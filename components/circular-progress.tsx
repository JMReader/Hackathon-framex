import type { Subject } from "@/types"

interface CircularProgressProps {
  subjects: Subject[]
  size?: number
}

export function CircularProgress({ subjects, size = 220 }: CircularProgressProps) {
  const center = size / 2
  const radius = size / 2 - 20
  const circumference = 2 * Math.PI * radius

  // Calculate counts for each status
  const statusCounts = {
    Promocionada: subjects.filter((s) => s.status === "Promocionada").length,
    Aprobada: subjects.filter((s) => s.status === "Aprobada").length,
    "En curso": subjects.filter((s) => s.status === "En curso").length,
    "Sin cursar": subjects.filter((s) => s.status === "Sin cursar").length,
  }

  const total = subjects.length
  const completedCount = statusCounts["Promocionada"] + statusCounts["Aprobada"]
  const completedPercentage = Math.round((completedCount / total) * 100)

  // Calculate angles for each segment
  const segments = [
    { status: "Promocionada", count: statusCounts["Promocionada"], color: "#8b5cf6", bgColor: "#f3e8ff" },
    { status: "Aprobada", count: statusCounts["Aprobada"], color: "#10b981", bgColor: "#d1fae5" },
    { status: "En curso", count: statusCounts["En curso"], color: "#3b82f6", bgColor: "#dbeafe" },
    { status: "Sin cursar", count: statusCounts["Sin cursar"], color: "#6b7280", bgColor: "#f3f4f6" },
  ]

  let currentAngle = -90 // Start from top

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle cx={center} cy={center} r={radius} fill="none" stroke="#f3f4f6" strokeWidth="16" />

          {/* Progress segments */}
          {segments.map((segment, index) => {
            if (segment.count === 0) return null

            const segmentAngle = (segment.count / total) * 360
            const strokeDasharray = `${(segmentAngle / 360) * circumference} ${circumference}`
            const rotation = currentAngle

            const segmentElement = (
              <circle
                key={segment.status}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="16"
                strokeDasharray={strokeDasharray}
                strokeDashoffset="0"
                style={{
                  transformOrigin: `${center}px ${center}px`,
                  transform: `rotate(${rotation}deg)`,
                }}
                strokeLinecap="round"
              />
            )

            currentAngle += segmentAngle
            return segmentElement
          })}
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-gray-900">{completedPercentage}%</div>
          <div className="text-sm text-gray-500">Completado</div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
        {segments.map((segment) => (
          <div key={segment.status} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
            <span className="text-gray-600">
              {segment.status} ({segment.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
