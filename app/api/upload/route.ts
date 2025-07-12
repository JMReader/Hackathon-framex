// app/api/upload/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateObject } from "ai"
import { z } from "zod"
import pdfParse from "pdf-parse"
import { ExtractedSubjectsSchema } from "@/types" // Import the Zod schema

// Necesitamos el runtime Node porque pdf-parse usa APIs de Node.js
export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 })
    }

    // Convert file to Buffer for pdf-parse
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract text from PDF
    const data = await pdfParse(buffer)
    const pdfText = data.text

    if (!pdfText || pdfText.trim().length < 50) {
      // Basic check for minimal content
      return NextResponse.json(
        { error: "PDF content is too short or empty. Cannot extract subjects." },
        { status: 400 },
      )
    }

    // Use Groq LLM to extract structured data
    const result = await generateObject({
      model: groq("llama3-8b-8192"), // Using a suitable Groq model
      schema: ExtractedSubjectsSchema,
      prompt: `Eres un asistente experto en planes de estudio universitarios. Tu tarea es extraer una lista de materias de un plan de estudios en formato PDF.
      El usuario te proporcionará el texto completo del PDF.
      
      Extrae las siguientes propiedades para cada materia:
      - \`name\`: El nombre completo de la materia.
      - \`year\`: El año o nivel de la carrera en que se cursa la materia (ej. 1, 2, 3). Si no se especifica, intenta inferirlo o usa 1.
      - \`workloadHours\`: La carga horaria total de la materia en horas. Si no se especifica, usa 0.
      - \`correlatives\`: Un array de nombres de materias que son correlativas (pre-requisitos). Si no hay, un array vacío.
      
      Formato de salida: Un objeto JSON con una propiedad 'subjects' que es un array de objetos de materia.
      
      Ejemplo de formato de salida:
      {
        "subjects": [
          {
            "name": "Análisis Matemático I",
            "year": 1,
            "workloadHours": 120,
            "correlatives": []
          },
          {
            "name": "Física II",
            "year": 2,
            "workloadHours": 90,
            "correlatives": ["Física I", "Análisis Matemático I"]
          }
        ]
      }
      
      Aquí está el texto del PDF:
      ${pdfText}`,
    })

    // Validate the LLM output against the schema
    const extractedData = ExtractedSubjectsSchema.parse(result.object)

    return NextResponse.json({
      message: "File processed and subjects extracted successfully",
      filename: file.name,
      subjects: extractedData.subjects,
    })
  } catch (error: any) {
    console.error("Error processing PDF or with LLM:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data extracted by AI", details: error.errors }, { status: 422 })
    }
    return NextResponse.json({ error: error.message || "Failed to process PDF and extract subjects" }, { status: 500 })
  }
}
