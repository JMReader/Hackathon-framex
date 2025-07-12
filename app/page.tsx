"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/file-upload"
import { SubjectsPreview } from "@/components/subjects-preview"
import { mockSubjects } from "@/lib/constants"

interface Subject {
  id: string
  name: string
  year: number
  workloadHours: number
  correlatives?: string[]
  status: SubjectStatus
}

type SubjectStatus = "Sin cursar" | "En curso" | "Aprobada" | "Promocionada"

const statusColors = {
  "Sin cursar": "bg-gray-100 text-gray-800 border-gray-200",
  "En curso": "bg-blue-100 text-blue-800 border-blue-200",
  Aprobada: "bg-green-100 text-green-800 border-green-200",
  Promocionada: "bg-purple-100 text-purple-800 border-purple-200",
}

const statusIcons = {
  "Sin cursar": "⏳",
  "En curso": "📚",
  Aprobada: "✅",
  Promocionada: "🏆",
}

export default function HomePage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects)
  const [filter, setFilter] = useState<"all" | "approved" | "pending" | "in-progress">("all")
  const router = useRouter()

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
    // Here you would typically send the file to your API
    // const formData = new FormData()
    // formData.append('file', file)
    // await fetch('/api/upload', { method: 'POST', body: formData })
  }

  const handleFileRemove = () => {
    setUploadedFile(null)
  }

  const handleContinue = () => {
    // Here you would typically save the career data to your backend
    // and then redirect to the dashboard
    router.push("/dashboard")
  }

  const updateSubjectStatus = (subjectId: string, newStatus: SubjectStatus) => {
    setSubjects((prev) =>
      prev.map((subject) => (subject.id === subjectId ? { ...subject, status: newStatus } : subject)),
    )
  }

  const filteredSubjects = subjects.filter((subject) => {
    switch (filter) {
      case "approved":
        return subject.status === "Aprobada" || subject.status === "Promocionada"
      case "pending":
        return subject.status === "Sin cursar"
      case "in-progress":
        return subject.status === "En curso"
      default:
        return true
    }
  })

  const completedSubjects = subjects.filter((s) => s.status === "Aprobada" || s.status === "Promocionada").length
  const progressPercentage = Math.round((completedSubjects / subjects.length) * 100)
  const estimatedSemesters = Math.ceil((subjects.length - completedSubjects) / 4)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <GraduationCap className="w-16 h-16 mx-auto mb-4 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Seguimiento Académico</h1>
          <p className="text-gray-600">Cargá tu plan de estudios para comenzar a trackear tu progreso</p>
        </div>

        <FileUpload onFileUpload={handleFileUpload} uploadedFile={uploadedFile} onFileRemove={handleFileRemove} />

        {uploadedFile && <SubjectsPreview subjects={mockSubjects} />}

        {uploadedFile && (
          <div className="text-center">
            <Button onClick={handleContinue} size="lg" className="bg-indigo-600 hover:bg-indigo-700">
              Continuar al Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
