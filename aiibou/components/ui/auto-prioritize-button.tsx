"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useTaskStore } from "@/components/ui/task-store"
import { useGoalStore } from "@/components/ui/goal-store"
import { autoLinkTasksToGoals, waitUntilModelReady } from "@/lib/priorityAgent"

export function AutoPrioritizeButton() {
  const tasks = useTaskStore((s) => s.tasks)
  const updateTask = useTaskStore((s) => s.updateTask)
  const goals = useGoalStore((s) => s.goals)
  const sortTasksByPriority = useTaskStore((s) => s.sortTasksByPriority)

  const [loading, setLoading] = useState(false)
  const [modelReady, setModelReady] = useState(false)

  useEffect(() => {
    waitUntilModelReady()
      .then(() => {
        console.log("[AutoPrioritize] Model is ready.")
        setModelReady(true)
      })
      .catch((err) => {
        console.error("[AutoPrioritize] Model failed to load:", err)
      })
  }, [])

  async function handleAutoLink() {
    setLoading(true)
    try {
      const result = await autoLinkTasksToGoals(tasks, goals)

      let updated = 0
      for (const [taskId, goalIdAndScore] of Object.entries(result)) {
        const [goalId, score] = goalIdAndScore ?? [null, 0]
        if (goalId) {
          updateTask(taskId, { linkedGoal: goalId, priority: score })
          updated++
        }
      }

      if (updated > 0) {
        sortTasksByPriority()
        alert(`✅ Linked ${updated} task(s) to goals.`)
      } else {
        alert("No tasks were linked. Nothing matched.")
      }
    } catch (err) {
      console.error("[AutoPrioritize] Failed:", err)
      alert("⚠️ Something went wrong. See console.")
    }
    setLoading(false)
  }

  const isDisabled =
    loading || !modelReady || tasks.length === 0 || goals.length === 0

  return (
    <div className="flex flex-col items-start gap-2">
      <Button onClick={handleAutoLink} disabled={isDisabled} variant="outline">
        {loading
          ? "Linking..."
          : !modelReady
          ? "Loading model..."
          : "Auto-prioritize Tasks"}
      </Button>

      <p className="text-sm text-muted-foreground">
        {loading
          ? "Running LLM locally..."
          : !modelReady
          ? "Model loading (~80MB, 5–30s)..."
          : "LLM ready ✅"}
      </p>
    </div>
  )
}
