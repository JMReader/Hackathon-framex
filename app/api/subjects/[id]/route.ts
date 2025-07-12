// app/api/subjects/[id]/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { SubjectSchema } from "@/types"
import { z } from "zod"

// This would typically interact with your database
// For demonstration, we'll use a simple in-memory array (not persistent across requests)
// In a real app, you'd fetch the specific subject from DB, update it, and save.
const inMemorySubjects: z.infer<typeof SubjectSchema>[] = [] // This array is separate from the one in /api/subjects/route.ts in a real setup.

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    const body = await request.json()

    // Validate incoming data for partial updates
    const parsedUpdate = SubjectSchema.partial().parse(body)

    // In a real application, find and update the subject in your database
    // Example: const updatedSubject = await db.subjects.update(id, parsedUpdate);

    return NextResponse.json({
      message: "Subject updated successfully",
      subjectId: id,
      updates: parsedUpdate,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update subject" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  // In a real application, delete the subject from your database
  // Example: await db.subjects.delete(id);

  return NextResponse.json({
    message: "Subject deleted successfully",
    subjectId: id,
  })
}
