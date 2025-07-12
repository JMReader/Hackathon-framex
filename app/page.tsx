"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/file-upload"
import { SubjectsPreview } from "@/components/subjects-preview"
import { mockSubjects } from "@/lib/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

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

        {!uploadedFile && (
          <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-8 h-8 text-indigo-600" />
                    <div>
                      <h1 className="text-xl font-semibold text-gray-900">Ingeniería en Sistemas</h1>
                      <p className="text-sm text-gray-500">Universidad Tecnológica Nacional</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => router.push("/upload")} className="hidden sm:flex">
                    Cambiar Carrera
                  </Button>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Progress Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card className="lg:col-span-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {/* Placeholder for icon */}
                      Progreso General
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    {/* Placeholder for CircularProgress component */}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {/* Placeholder for icon */}
                      Tiempo Estimado
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{estimatedSemesters}</p>
                      <p className="text-sm text-gray-500">
                        {estimatedSemesters === 1 ? "semestre restante" : "semestres restantes"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Estimación basada en 4 materias por semestre</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Resumen Detallado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                          <span>Promocionadas:</span>
                        </div>
                        <span className="font-medium text-purple-600">
                          {subjects.filter((s) => s.status === "Promocionada").length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span>Aprobadas:</span>
                        </div>
                        <span className="font-medium text-green-600">
                          {subjects.filter((s) => s.status === "Aprobada").length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span>En curso:</span>
                        </div>
                        <span className="font-medium text-blue-600">
                          {subjects.filter((s) => s.status === "En curso").length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                          <span>Sin cursar:</span>
                        </div>
                        <span className="font-medium text-gray-600">
                          {subjects.filter((s) => s.status === "Sin cursar").length}
                        </span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between font-medium">
                          <span>Total:</span>
                          <span>{subjects.length}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters and Subject List */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="flex items-center gap-2">
                      {/* Placeholder for icon */}
                      Materias de la Carrera
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {/* Placeholder for icon */}
                      <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas las materias</SelectItem>
                          <SelectItem value="approved">Solo aprobadas</SelectItem>
                          <SelectItem value="in-progress">En curso</SelectItem>
                          <SelectItem value="pending">Pendientes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {filteredSubjects.map((subject) => (
                      <div
                        key={subject.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-gray-900 truncate">{subject.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {subject.year}° Año
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{subject.workloadHours} horas</span>
                            {subject.correlatives && subject.correlatives.length > 0 && (
                              <span className="hidden sm:inline">Correlativas: {subject.correlatives.join(", ")}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-3 sm:mt-0">
                          <Badge className={`${statusColors[subject.status]} border`} variant="outline">
                            <span className="mr-1">{statusIcons[subject.status]}</span>
                            {subject.status}
                          </Badge>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Cambiar
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Cambiar Estado</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <p className="text-sm text-gray-600">
                                  Seleccioná el nuevo estado para <strong>{subject.name}</strong>
                                </p>
                                <div className="grid gap-2">
                                  {(["Sin cursar", "En curso", "Aprobada", "Promocionada"] as SubjectStatus[]).map(
                                    (status) => (
                                      <Button
                                        key={status}
                                        variant={subject.status === status ? "default" : "outline"}
                                        className="justify-start"
                                        onClick={() => updateSubjectStatus(subject.id, status)}
                                      >
                                        <span className="mr-2">{statusIcons[status]}</span>
                                        {status}
                                      </Button>
                                    ),
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredSubjects.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {/* Placeholder for icon */}
                      <p>No hay materias que coincidan con el filtro seleccionado</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
