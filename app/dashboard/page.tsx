"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap, Clock, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircularProgress } from "@/components/circular-progress"
import { SubjectList } from "@/components/subject-list"
import { mockSubjects } from "@/lib/constants"
import type { Subject, SubjectStatus } from "@/types"

export default function DashboardPage() {
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects)
  const router = useRouter()

  const updateSubjectStatus = (subjectId: string, newStatus: SubjectStatus) => {
    setSubjects((prev) =>
      prev.map((subject) => (subject.id === subjectId ? { ...subject, status: newStatus } : subject)),
    )
    // Here you would typically update the subject in your backend
    // await fetch(`/api/subjects/${subjectId}`, {
    //   method: 'PATCH',
    //   body: JSON.stringify({ status: newStatus })
    // })
  }

  const completedSubjects = subjects.filter((s) => s.status === "Aprobada" || s.status === "Promocionada").length
  const estimatedSemesters = Math.ceil((subjects.length - completedSubjects) / 4)

  return (
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
            <Button variant="outline" onClick={() => router.push("/")} className="hidden sm:flex">
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
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Progreso General
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <CircularProgress subjects={subjects} size={220} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
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

        {/* Subject List */}
        <SubjectList subjects={subjects} onUpdateSubject={updateSubjectStatus} />
      </div>
    </div>
  )
}
