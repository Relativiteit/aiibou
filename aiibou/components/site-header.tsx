"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useGoalStore } from "@/components/ui/goal-store"

export function SiteHeader() {
  const goals = useGoalStore((state) => state.goals)
  const activeGoalId = useGoalStore((state) => state.activeGoalId)
  const setActiveGoal = useGoalStore((state) => state.setActiveGoal)
  const updateGoal = useGoalStore((state) => state.updateGoal)
  const addGoal = useGoalStore((state) => state.addGoal)

  const activeGoal = goals.find((g) => g.id === activeGoalId) || null
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState("")

  function handleGoalSubmit() {
    if (!title.trim()) return
    if (activeGoal) {
      updateGoal(activeGoal.id, title.trim())
    } else {
      addGoal(title.trim())
    }
    setTitle("")
    setEditing(false)
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {editing ? (
          <div className="flex items-center gap-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGoalSubmit()}
              placeholder="Enter your long-term goal"
              className="max-w-xs h-8 text-sm"
              autoFocus
            />
            <Button size="sm" variant="outline" onClick={handleGoalSubmit}>
              Save
            </Button>
          </div>
        ) : activeGoal ? (
          <div
            className="text-base font-medium text-muted-foreground cursor-pointer"
            onClick={() => {
              setTitle(activeGoal.title)
              setEditing(true)
            }}
          >
            Long-term goal: <span className="text-foreground">{activeGoal.title}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGoalSubmit()}
              placeholder="Set your long-term goal..."
              className="max-w-xs h-8 text-sm"
            />
          </div>
        )}

        {goals.length > 1 && (
          <Select value={activeGoalId || ""} onValueChange={setActiveGoal}>
            <SelectTrigger className="w-[180px] ml-4">
              <SelectValue placeholder="Select a goal" />
            </SelectTrigger>
            <SelectContent>
              {goals.map((goal) => (
                <SelectItem key={goal.id} value={goal.id}>
                  {goal.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/Relativiteit/aiibou"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
