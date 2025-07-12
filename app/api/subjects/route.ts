import { type NextRequest, NextResponse } from "next/server"
import type { Subject } from "@/types"

// This would typically connect to your database
const subjects: Subject[] = []

export async function GET() {
  // Fetch subjects from database
  return NextResponse.json({ subjects })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Create new subject in database
  const newSubject: Subject = {
    id: Date.now().toString(),
    ...body,
  }

  subjects.push(newSubject)

  return NextResponse.json({ subject: newSubject }, { status: 201 })
}
