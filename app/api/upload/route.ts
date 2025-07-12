// app/api/upload/route.ts
import { NextResponse, type NextRequest } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateObject } from "ai"
import { z } from "zod"
import { ExtractedSubjectsSchema } from "@/types"

import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs"

// pdfjs necesita saber dónde está su worker; en server-side podemos desactivarlo.
GlobalWorkerOptions.workerSrc = undefined

export const runtime = "nodejs" // Necesitamos Buffer

/** Extrae el texto completo de un PDF (máx 25 páginas para no exceder tokens) */
async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const loadingTask = getDocument({ data: buffer })
  const pdf = await loadingTask.promise
  const totalPages = Math.min(pdf.numPages, 25)

  let fullText = ""
  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()
    const strings = content.items.map((it: any) => it.str)
    fullText += strings.join(" ") + "\n"
  }
  await pdf.destroy()
  return fullText
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Solo se admiten archivos PDF." }, { status: 400 })
    }

    // Buffer del PDF
    const buffer = Buffer.from(await file.arrayBuffer())

    // 1. Extraer texto
    const pdfText = await extractTextFromPdf(buffer)
    if (pdfText.trim().length < 50) {
      return NextResponse.json({ error: "El PDF no contiene texto suficiente para analizar." }, { status: 400 })
    }

    // 2. Enviar texto al LLM (Groq) para estructurarlo
    const result = await generateObject({
      model: groq("llama3-8b-8192"),
      schema: ExtractedSubjectsSchema,
      prompt: `Eres un asistente experto en planes de estudio universitarios. 
Extrae las materias con esta estructura:

{
  "subjects": [
    { "name": "...", "year": 1, "workloadHours": 0, "correlatives": [] }
  ]
}

Texto del PDF (puede estar desordenado, tú lo interpretas):
"""
${pdfText}
"""`,
    })

    const extracted = ExtractedSubjectsSchema.parse(result.object)

    return NextResponse.json(
      {
        message: "Materias extraídas correctamente",
        filename: file.name,
        subjects: extracted.subjects,
      },
      { status: 200 },
    )
  } catch (err: any) {
    console.error("UPLOAD ERROR →", err)
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Formato devuelto por la IA inválido", details: err.errors }, { status: 422 })
    }
    return NextResponse.json(
      { error: "Fallo interno al procesar el PDF. Revisa el log del servidor." },
      { status: 500 },
    )
  }
}
