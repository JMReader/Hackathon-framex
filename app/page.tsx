// app/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/file-upload"
import { EditableSubjectsTable } from "@/components/editable-subjects-table"
import type { Subject } from "@/types"

export default function HomePage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([]) // Start with empty subjects
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file)
    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)

    // util interno
    const parseErrorResponse = async (res: Response) => {
      try {
        const data = await res.json()
        return data?.error || data?.message || res.statusText
      } catch {
        const text = await res.text()
        return text || "Error inesperado del servidor."
      }
    }

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const msg = await parseErrorResponse(response)
        throw new Error(msg)
      }

      const data = await response.json()
      // Assign unique IDs and default status to extracted subjects
      const extractedSubjectsWithIds: Subject[] = data.subjects.map((sub: Omit<Subject, "id" | "status">) => ({
        id: String(Date.now()) + Math.random().toString(36).substring(2, 9), // Simple unique ID
        status: "Sin cursar",
        ...sub,
      }))
      setSubjects(extractedSubjectsWithIds)
    } catch (err: any) {
      console.error("Error uploading file:", err)
      setError(err.message || "Ocurrió un error inesperado al subir el archivo.")
      setSubjects([]) // Clear subjects on error
      setUploadedFile(null) // Clear uploaded file on error
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileRemove = () => {
    setUploadedFile(null)
    setSubjects([]) // Clear subjects when file is removed
    setError(null)
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
          <p className="text-gray-600">Cargá el plan de estudios de tu carrera en PDF</p>
        </div>

        <FileUpload
          onFileUpload={handleFileUpload}
          uploadedFile={uploadedFile}
          onFileRemove={handleFileRemove}
          isLoading={isLoading}
          error={error}
        />

        {uploadedFile && !isLoading && subjects.length > 0 && (
          <>
            <EditableSubjectsTable subjects={subjects} onUpdateSubjects={handleUpdateSubjects} />
            <div className="text-center">
              <Button onClick={handleContinue} size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                Continuar al Dashboard
              </Button>
            </div>
          </>
        )}

        {uploadedFile && !isLoading && subjects.length === 0 && !error && (
          <div className="text-center py-8 text-gray-500">
            <p>No se pudieron extraer materias del PDF. Por favor, revisa el archivo o agrégalas manualmente.</p>
          </div>
        )}
      </div>
    </div>
  )
}
