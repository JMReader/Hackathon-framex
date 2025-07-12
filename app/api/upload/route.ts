// app/api/upload/route.ts
import { NextResponse, type NextRequest } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateObject } from "ai"
import { z } from "zod"
import { ExtractedSubjectsSchema } from "@/types"

export const runtime = "nodejs" // pdf parsing needs Buffer APIs

/**
 * Extract all visible text from a PDF buffer.
 * We dynamically import pdfjs-dist to avoid bundler / ESM issues.
 */
async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  // Dynamic import so the module is only evaluated in the Node runtime
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.js")
  // Disable worker usage on the server
  pdfjs.GlobalWorkerOptions.workerSrc = undefined

  const pdf = await pdfjs.getDocument({ data: buffer }).promise
  const pages = Math.min(pdf.numPages, 30) // read max 30 pages
  let text = ""
  for (let i = 1; i <= pages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    text += content.items.map((it: any) => it.str).join(" ") + "\n"
  }
  await pdf.destroy()
  return text
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "La variable GROQ_API_KEY no está configurada." }, { status: 500 })
    }

    const formData = await request.formData({ size: 2_000_000 }) // 2 MB safety limit
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No se recibió archivo." }, { status: 400 })
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Solo se admiten archivos PDF." }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // 1 – extraer texto del PDF
    const pdfText = await extractTextFromPdf(buffer)
    if (pdfText.trim().length < 50) {
      return NextResponse.json({ error: "El PDF no contiene suficiente texto legible para analizar." }, { status: 400 })
    }

    // 2 – enviar a Groq para estructurar las materias
    const llmResponse = await generateObject({
      model: groq("llama3-8b-8192"),
      schema: ExtractedSubjectsSchema,
      prompt: `Eres un asistente experto en planes de estudio universitarios.
Devuelve UN OBJETO JSON con una clave "subjects" que sea array de materias:
name (string), year (number), workloadHours (number), correlatives (array string).

Texto del PDF:
"""
${pdfText}
"""`,
    })

    const parsed = ExtractedSubjectsSchema.parse(llmResponse.object)

    return NextResponse.json(
      {
        message: "Materias extraídas correctamente.",
        filename: file.name,
        subjects: parsed.subjects,
      },
      { status: 200 },
    )
  } catch (err: any) {
    // Log completo en consola para depuración
    console.error("UPLOAD /api/upload error →", err)
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Formato devuelto por la IA inválido.", details: err.errors }, { status: 422 })
    }
    return NextResponse.json({ error: err.message || "Fallo interno desconocido." }, { status: 500 })
  }
}
