import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Subject } from "@/types"

interface SubjectsPreviewProps {
  subjects: Subject[]
}

export function SubjectsPreview({ subjects }: SubjectsPreviewProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Vista Previa de Materias Extraídas</CardTitle>
        <CardDescription>Revisá que la información extraída sea correcta antes de continuar</CardDescription>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.slice(0, 5).map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-medium">{subject.name}</TableCell>
                  <TableCell>{subject.year}°</TableCell>
                  <TableCell>{subject.workloadHours}hs</TableCell>
                  <TableCell>{subject.correlatives?.join(", ") || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-sm text-gray-500 mt-2">Mostrando 5 de {subjects.length} materias extraídas</p>
      </CardContent>
    </Card>
  )
}
