export type SubjectStatus = "Sin cursar" | "En curso" | "Aprobada" | "Promocionada"

export interface Subject {
  id: string
  name: string
  year: number
  workloadHours: number
  correlatives?: string[]
  status: SubjectStatus
}

export interface Career {
  id: string
  name: string
  university: string
  subjects: Subject[]
}
