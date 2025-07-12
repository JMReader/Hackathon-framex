import { type NextRequest, NextResponse } from "next/server"
import { SubjectSchema } from "@/types" // Import schema for validation
import { z } from "zod"
import type { Subject } from "@/types"

// This would typically connect to your database
// For demonstration, we'll use a simple in-memory array (not persistent across requests)
const inMemorySubjects: Subject[] = []

export async function GET() {
  // In a real application, fetch subjects from your database
  return NextResponse.json({ subjects: inMemorySubjects })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate incoming data with Zod
    const parsedSubject = SubjectSchema.parse(body)

    // In a real application, save new subject to database
    const newSubject: Subject = {
      id: Date.now().toString(), // Generate a simple ID
      status: "Sin cursar", // Default status for new subjects
      ...parsedSubject,
    }

    inMemorySubjects.push(newSubject) // Add to in-memory array for demo

    return NextResponse.json({ subject: newSubject }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create subject" }, { status: 500 })
  }
}
