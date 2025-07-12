import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const body = await request.json()

  // Update subject in database
  // const updatedSubject = await updateSubject(id, body)

  return NextResponse.json({
    message: "Subject updated successfully",
    subjectId: id,
    updates: body,
  })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  // Delete subject from database
  // await deleteSubject(id)

  return NextResponse.json({
    message: "Subject deleted successfully",
    subjectId: id,
  })
}
