"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"

export type Task = {
  id: string
  title: string
  createdAt: string
  completedAt?: string
  isDone: boolean
  pomodoroSessions: number
  linkedGoal?: string
  priority?: number
}

type TaskStore = {
  tasks: Task[]
  addTask: (title: string) => void
  toggleDone: (id: string) => void
  incrementPomodoro: (id: string) => void
  clearCompleted: () => void
  deleteTask: (id: string) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  sortTasksByPriority: () => void
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (title) => {
        const newTask: Task = {
          id: uuidv4(),
          title,
          createdAt: new Date().toISOString(),
          isDone: false,
          pomodoroSessions: 0,
        }
        set({ tasks: [newTask, ...get().tasks] })
      },
      toggleDone: (id) => {
        set({
          tasks: get().tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  isDone: !task.isDone,
                  completedAt: !task.isDone ? new Date().toISOString() : undefined,
                }
              : task
          ),
        })
      },
      incrementPomodoro: (id) => {
        set({
          tasks: get().tasks.map((task) =>
            task.id === id
              ? { ...task, pomodoroSessions: task.pomodoroSessions + 1 }
              : task
          ),
        })
      },
      clearCompleted: () => {
        set({ tasks: get().tasks.filter((t) => !t.isDone) })
      },
      deleteTask: (id) => {
        set({ tasks: get().tasks.filter((t) => t.id !== id) })
      },
      updateTask: (id, updates) => {
        set({
          tasks: get().tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })
      },
      sortTasksByPriority: () => {
        const sorted = [...get().tasks].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
        set({ tasks: sorted })
      },
    }),
    {
      name: "aiibou-task-storage",
    }
  )
)
