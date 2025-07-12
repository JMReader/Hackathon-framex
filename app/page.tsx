"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/file-upload"
import { EditableSubjectsTable } from "@/components/editable-subjects-table" // Updated import
import { mockSubjects } from "@/lib/constants"
import type { Subject } from "@/types"

export default function HomePage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects) // State for subjects
  const router = useRouter()

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
    // In a real app, you'd send the file to your API for processing
    // and then update the 'subjects' state with the extracted data.
    // For now, we'll keep using mockSubjects after upload for demonstration.
    // Example: fetch('/api/upload', { method: 'POST', body: formData }).then(res => res.json()).then(data => setSubjects(data.subjects))
  }

  const handleFileRemove = () => {
    setUploadedFile(null)
    // Optionally reset subjects if file is removed
    // setSubjects([])
  }

  const handleUpdateSubjects = (updatedSubjects: Subject[]) => {
    setSubjects(updatedSubjects)
  }

  const handleContinue = () => {
    // In a real app, you'd save the final 'subjects' data to your backend
    // await fetch('/api/career-plan', { method: 'POST', body: JSON.stringify({ subjects }) })
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <GraduationCap className="w-16 h-16 mx-auto mb-4 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Seguimiento Académico</h1>
          <p className="text-gray-600">Cargá tu plan de estudios para comenzar a trackear tu progreso</p>
        </div>

        <FileUpload onFileUpload={handleFileUpload} uploadedFile={uploadedFile} onFileRemove={handleFileRemove} />

        {uploadedFile && (
          <>
            <EditableSubjectsTable subjects={subjects} onUpdateSubjects={handleUpdateSubjects} />
            <div className="text-center">
              <Button onClick={handleContinue} size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                Continuar al Dashboard
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
