"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2 } from "lucide-react"
import type { Subject } from "@/types"

interface EditableSubjectsTableProps {
  subjects: Subject[]
  onUpdateSubjects: (updatedSubjects: Subject[]) => void
}

export function EditableSubjectsTable({ subjects, onUpdateSubjects }: EditableSubjectsTableProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null)

  const [newSubjectData, setNewSubjectData] = useState<Omit<Subject, "id" | "status">>({
    name: "",
    year: 1,
    workloadHours: 0,
    correlatives: [],
  })

  const handleAddSubject = () => {
    const newId = String(Date.now())
    const updatedSubjects = [
      ...subjects,
      {
        id: newId,
        status: "Sin cursar", // Default status for new subjects
        ...newSubjectData,
        correlatives: newSubjectData.correlatives?.filter(Boolean) || [], // Clean up empty correlatives
      },
    ]
    onUpdateSubjects(updatedSubjects)
    setNewSubjectData({ name: "", year: 1, workloadHours: 0, correlatives: [] }) // Reset form
    setIsAddModalOpen(false)
  }

  const handleEditSubject = () => {
    if (currentSubject) {
      const updatedSubjects = subjects.map((sub) =>
        sub.id === currentSubject.id
          ? { ...currentSubject, correlatives: currentSubject.correlatives?.filter(Boolean) || [] }
          : sub,
      )
      onUpdateSubjects(updatedSubjects)
      setIsEditModalOpen(false)
      setCurrentSubject(null)
    }
  }

  const handleDeleteSubject = (id: string) => {
    const updatedSubjects = subjects.filter((sub) => sub.id !== id)
    onUpdateSubjects(updatedSubjects)
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Materias de la Carrera</CardTitle>
            <CardDescription>Revisá y editá las materias extraídas. Podés añadir nuevas si faltan.</CardDescription>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Materia
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Agregar Nueva Materia</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nombre
                  </Label>
                  <Input
                    id="name"
                    value={newSubjectData.name}
                    onChange={(e) => setNewSubjectData({ ...newSubjectData, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="year" className="text-right">
                    Año
                  </Label>
                  <Input
                    id="year"
                    type="number"
                    value={newSubjectData.year}
                    onChange={(e) =>
                      setNewSubjectData({ ...newSubjectData, year: Number.parseInt(e.target.value) || 1 })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="workloadHours" className="text-right">
                    Carga Horaria
                  </Label>
                  <Input
                    id="workloadHours"
                    type="number"
                    value={newSubjectData.workloadHours}
                    onChange={(e) =>
                      setNewSubjectData({ ...newSubjectData, workloadHours: Number.parseInt(e.target.value) || 0 })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="correlatives" className="text-right">
                    Correlativas
                  </Label>
                  <Textarea
                    id="correlatives"
                    value={newSubjectData.correlatives?.join(", ") || ""}
                    onChange={(e) =>
                      setNewSubjectData({
                        ...newSubjectData,
                        correlatives: e.target.value.split(",").map((s) => s.trim()),
                      })
                    }
                    placeholder="Separar por coma (ej: Análisis I, Álgebra)"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddSubject}>
                  Guardar Materia
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Materia</TableHead>
                <TableHead>Año</TableHead>
                <TableHead>Carga Horaria</TableHead>
                <TableHead>Correlativas</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                    No hay materias cargadas. ¡Agregá la primera!
                  </TableCell>
                </TableRow>
              ) : (
                subjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">{subject.name}</TableCell>
                    <TableCell>{subject.year}°</TableCell>
                    <TableCell>{subject.workloadHours}hs</TableCell>
                    <TableCell>{subject.correlatives?.join(", ") || "-"}</TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      <Dialog
                        open={isEditModalOpen && currentSubject?.id === subject.id}
                        onOpenChange={setIsEditModalOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCurrentSubject(subject)
                              setIsEditModalOpen(true)
                            }}
                          >
                            <Edit className="w-4 h-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Editar Materia</DialogTitle>
                          </DialogHeader>
                          {currentSubject && (
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-name" className="text-right">
                                  Nombre
                                </Label>
                                <Input
                                  id="edit-name"
                                  value={currentSubject.name}
                                  onChange={(e) => setCurrentSubject({ ...currentSubject, name: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-year" className="text-right">
                                  Año
                                </Label>
                                <Input
                                  id="edit-year"
                                  type="number"
                                  value={currentSubject.year}
                                  onChange={(e) =>
                                    setCurrentSubject({ ...currentSubject, year: Number.parseInt(e.target.value) || 1 })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-workloadHours" className="text-right">
                                  Carga Horaria
                                </Label>
                                <Input
                                  id="edit-workloadHours"
                                  type="number"
                                  value={currentSubject.workloadHours}
                                  onChange={(e) =>
                                    setCurrentSubject({
                                      ...currentSubject,
                                      workloadHours: Number.parseInt(e.target.value) || 0,
                                    })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-correlatives" className="text-right">
                                  Correlativas
                                </Label>
                                <Textarea
                                  id="edit-correlatives"
                                  value={currentSubject.correlatives?.join(", ") || ""}
                                  onChange={(e) =>
                                    setCurrentSubject({
                                      ...currentSubject,
                                      correlatives: e.target.value.split(",").map((s) => s.trim()),
                                    })
                                  }
                                  placeholder="Separar por coma (ej: Análisis I, Álgebra)"
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button type="submit" onClick={handleEditSubject}>
                              Guardar Cambios
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteSubject(subject.id)}>
                        <Trash2 className="w-4 h-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
