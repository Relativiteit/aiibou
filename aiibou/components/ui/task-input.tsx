"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { v4 as uuidv4 } from "uuid"
import { Plus } from "lucide-react"

type Task = {
  id: string
  title: string
  createdAt: string
}

export function TaskInput({
  onAddTask,
}: {
  onAddTask: (task: Task) => void
}) {
  const [title, setTitle] = useState("")

  function handleAddTask() {
    if (!title.trim()) return

    const task: Task = {
      id: uuidv4(),
      title: title.trim(),
      createdAt: new Date().toISOString(),
    }

    onAddTask(task)
    setTitle("")
  }

  return (
    <Card>
      <CardContent className="p-4 flex flex-col gap-2 items-center">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task..."
          className="w-full max-w-md"
        />
        <button
          onClick={handleAddTask}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Task
        </button>
      </CardContent>
    </Card>
  )
}
