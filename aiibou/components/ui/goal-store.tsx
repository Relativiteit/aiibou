"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"

export type Goal = {
  id: string
  title: string
  createdAt: string
}

type GoalStore = {
  goals: Goal[]
  activeGoalId: string | null
  addGoal: (title: string) => void
  deleteGoal: (id: string) => void
  updateGoal: (id: string, title: string) => void
  setActiveGoal: (id: string) => void
}

export const useGoalStore = create<GoalStore>()(
  persist(
    (set, get) => ({
      goals: [],
      activeGoalId: null,
      addGoal: (title) => {
        if (!title.trim()) return
        const newGoal: Goal = {
          id: uuidv4(),
          title,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          goals: [newGoal, ...state.goals],
          activeGoalId: state.activeGoalId || newGoal.id,
        }))
      },
      deleteGoal: (id) => {
        set((state) => {
          const remaining = state.goals.filter((g) => g.id !== id)
          const newActive = state.activeGoalId === id && remaining.length > 0 ? remaining[0].id : state.activeGoalId === id ? null : state.activeGoalId
          return {
            goals: remaining,
            activeGoalId: newActive,
          }
        })
      },
      updateGoal: (id, title) => {
        if (!title.trim()) return
        set({
          goals: get().goals.map((g) =>
            g.id === id ? { ...g, title } : g
          ),
        })
      },
      setActiveGoal: (id) => {
        set({ activeGoalId: id })
      },
    }),
    {
      name: "aiibou-goal-storage",
    }
  )
)
