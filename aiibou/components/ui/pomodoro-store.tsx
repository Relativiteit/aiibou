"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type PomodoroSession = {
  taskId?: string
  completedAt: string // ISO timestamp
}

type PomodoroStore = {
  activeTaskId?: string
  sessions: PomodoroSession[]
  startSession: (taskId?: string) => void
  completeSession: () => void
  clearSessions: () => void
}

export const usePomodoroStore = create<PomodoroStore>()(
  persist(
    (set, get) => ({
      activeTaskId: undefined,
      sessions: [],
      startSession: (taskId) => {
        set({ activeTaskId: taskId })
      },
      completeSession: () => {
        const taskId = get().activeTaskId
        const newSession: PomodoroSession = {
          taskId,
          completedAt: new Date().toISOString(),
        }
        set({
          sessions: [...get().sessions, newSession],
          activeTaskId: undefined,
        })
      },
      clearSessions: () => set({ sessions: [] }),
    }),
    { name: "aiibou-pomodoro-storage" }
  )
)
