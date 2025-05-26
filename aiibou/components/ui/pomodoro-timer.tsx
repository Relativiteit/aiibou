import React, { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { usePomodoroStore } from "@/components/ui/pomodoro-store"

export function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const completeSession = usePomodoroStore((state) => state.completeSession)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!)
            setIsRunning(false)
            completeSession()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, completeSession])

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(25 * 60)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="text-6xl font-bold tabular-nums tracking-wider">
        {formatTime(timeLeft)}
      </div>
      <div className="flex gap-4">
        <Button onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button onClick={resetTimer} variant="secondary">
          Reset
        </Button>
      </div>
    </div>
  )
}
