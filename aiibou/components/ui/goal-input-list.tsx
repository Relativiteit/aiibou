"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { useGoalStore, Goal } from "@/components/ui/goal-store"

export function GoalInputWithList() {
  const [title, setTitle] = useState("")
  const goals: Goal[] = useGoalStore((state) => state.goals)
  const addGoal = useGoalStore((state) => state.addGoal)
  const deleteGoal = useGoalStore((state) => state.deleteGoal)

  function handleAddGoal() {
    if (!title.trim()) return
    if (goals.length >= 3) return // Optional limit of 3
    addGoal(title.trim())
    setTitle("")
  }

  return (
    <Card>
      <CardContent className="p-4 flex flex-col gap-4">
        <div className="space-y-2 w-full">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="flex justify-between items-center text-lg border-b last:border-none pb-2"
            >
              <span className="font-medium text-center w-full">{goal.title}</span>
              <button
                onClick={() => deleteGoal(goal.id)}
                className="text-muted-foreground hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 items-center">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New goal... (e.g. Launch SnappyTool)"
            className="w-full max-w-md"
          />
          <button
            onClick={handleAddGoal}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Goal
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
