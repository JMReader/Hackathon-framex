import type { Subject } from "@/types"

export const mockSubjects: Subject[] = [
  { id: "1", name: "Análisis Matemático I", year: 1, workloadHours: 120, status: "Aprobada" },
  { id: "2", name: "Álgebra y Geometría Analítica", year: 1, workloadHours: 120, status: "Aprobada" },
  { id: "3", name: "Introducción a la Programación", year: 1, workloadHours: 90, status: "Promocionada" },
  {
    id: "4",
    name: "Física I",
    year: 1,
    workloadHours: 120,
    correlatives: ["Análisis Matemático I"],
    status: "En curso",
  },
  {
    id: "5",
    name: "Análisis Matemático II",
    year: 2,
    workloadHours: 120,
    correlatives: ["Análisis Matemático I"],
    status: "Sin cursar",
  },
  {
    id: "6",
    name: "Programación Orientada a Objetos",
    year: 2,
    workloadHours: 90,
    correlatives: ["Introducción a la Programación"],
    status: "Sin cursar",
  },
  {
    id: "7",
    name: "Estructuras de Datos",
    year: 2,
    workloadHours: 90,
    correlatives: ["Programación Orientada a Objetos"],
    status: "Sin cursar",
  },
  {
    id: "8",
    name: "Base de Datos",
    year: 3,
    workloadHours: 90,
    correlatives: ["Estructuras de Datos"],
    status: "Sin cursar",
  },
]

export const statusColors = {
  "Sin cursar": "bg-gray-100 text-gray-800 border-gray-200",
  "En curso": "bg-blue-100 text-blue-800 border-blue-200",
  Aprobada: "bg-green-100 text-green-800 border-green-200",
  Promocionada: "bg-purple-100 text-purple-800 border-purple-200",
}

export const statusIcons = {
  "Sin cursar": "⏳",
  "En curso": "📚",
  Aprobada: "✅",
  Promocionada: "🏆",
}
