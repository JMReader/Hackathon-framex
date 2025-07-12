"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FileUploadProps {
  onFileUpload: (file: File) => void
  uploadedFile: File | null
  onFileRemove: () => void
}

export function FileUpload({ onFileUpload, uploadedFile, onFileRemove }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === "application/pdf") {
        onFileUpload(file)
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type === "application/pdf") {
        onFileUpload(file)
      }
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Subir Plan de Estudios
        </CardTitle>
        <CardDescription>
          Subí el plan de estudios de tu carrera en PDF para extraer automáticamente las materias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? "border-indigo-500 bg-indigo-50"
              : uploadedFile
                ? "border-green-500 bg-green-50"
                : "border-gray-300 hover:border-indigo-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {uploadedFile ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-medium text-green-800">{uploadedFile.name}</p>
                <p className="text-sm text-green-600">Archivo cargado correctamente</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onFileRemove} className="text-red-500 hover:text-red-700">
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div>
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium text-gray-700 mb-2">Arrastrá tu archivo PDF aquí</p>
              <p className="text-gray-500 mb-4">o hacé click para seleccionar</p>
              <input type="file" accept=".pdf" onChange={handleFileInput} className="hidden" id="file-upload" />
              <Button
                variant="outline"
                className="cursor-pointer bg-transparent"
                onClick={() => {
                  const input = document.getElementById("file-upload") as HTMLInputElement
                  input?.click()
                }}
              >
                Seleccionar archivo
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
