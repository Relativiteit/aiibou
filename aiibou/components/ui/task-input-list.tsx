"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { useTaskStore, Task } from "@/components/ui/task-store"

export function TaskInputWithList() {
  const [title, setTitle] = useState("")
  const tasks: Task[] = useTaskStore((state) => state.tasks)
  const addTask = useTaskStore((state) => state.addTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const toggleDone = useTaskStore((state) => state.toggleDone)

  function handleAddTask() {
    if (!title.trim()) return
    addTask(title.trim())
    setTitle("")
  }

  return (
    <Card>
      <CardContent className="p-4 flex flex-col gap-4">
        <div className="space-y-2 w-full">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex justify-between items-center text-lg border-b last:border-none pb-2"
            >
              <div className="flex items-center gap-2 w-full">
                <input
                  type="checkbox"
                  checked={task.isDone}
                  onChange={() => toggleDone(task.id)}
                  className="accent-primary"
                />
                <span
                  className={`font-medium w-full text-center ${task.isDone ? "line-through text-muted-foreground" : ""}`}
                >
                  {task.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(task.createdAt).toLocaleTimeString()}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-muted-foreground hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 items-center">
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
        </div>
      </CardContent>
    </Card>
  )
}
