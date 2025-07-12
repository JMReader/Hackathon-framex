// components/subject-list.tsx
"use client"

import { useState } from "react"
import { BookOpen, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { statusColors, statusIcons } from "@/lib/constants"
import type { Subject, SubjectStatus } from "@/types"

interface SubjectListProps {
  subjects: Subject[]
  onUpdateSubject: (subjectId: string, newStatus: SubjectStatus) => void
}

export function SubjectList({ subjects, onUpdateSubject }: SubjectListProps) {
  const [filter, setFilter] = useState<"all" | "approved" | "pending" | "in-progress">("all")

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

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Materias de la Carrera
          </CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
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
                        {(["Sin cursar", "En curso", "Aprobada", "Promocionada"] as SubjectStatus[]).map((status) => (
                          <Button
                            key={status}
                            variant={subject.status === status ? "default" : "outline"}
                            className="justify-start"
                            onClick={() => onUpdateSubject(subject.id, status)}
                          >
                            <span className="mr-2">{statusIcons[status]}</span>
                            {status}
                          </Button>
                        ))}
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
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay materias que coincidan con el filtro seleccionado</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
