// types/index.ts
import { z } from "zod"

export const SubjectSchema = z.object({
  name: z.string().min(1, "El nombre de la materia es requerido."),
  year: z.number().int().min(1, "El año debe ser al menos 1.").max(10, "El año no puede ser mayor a 10."),
  workloadHours: z.number().int().min(0, "La carga horaria no puede ser negativa."),
  correlatives: z.array(z.string()).optional(),
})

export const ExtractedSubjectsSchema = z.object({
  subjects: z.array(SubjectSchema),
})

export type SubjectStatus = "Sin cursar" | "En curso" | "Aprobada" | "Promocionada"

export interface Subject extends z.infer<typeof SubjectSchema> {
  id: string
  status: SubjectStatus
}

export interface Career {
  id: string
  name: string
  university: string
  subjects: Subject[]
}
