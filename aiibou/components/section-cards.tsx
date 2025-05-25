"use client"

import { useTaskStore } from "@/components/ui/task-store"
import { useGoalStore } from "@/components/ui/goal-store"
import { usePomodoroStore } from "@/components/ui/pomodoro-store"
import { IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}

export function SectionCards() {
  const tasks = useTaskStore((s) => s.tasks)
  const pomodoros = usePomodoroStore((s) => s.sessions)
  const goals = useGoalStore((s) => s.goals)
  const activeGoalId = useGoalStore((s) => s.activeGoalId)

  const completed = tasks.filter((t) => t.completedAt)
  const aligned = completed.filter((t) => t.linkedGoal)

  // --- On track
  const onTrackPct = completed.length
    ? Math.round((aligned.length / completed.length) * 100)
    : 0

  const dayCounts: Record<string, number> = {}
  for (const task of completed) {
    const day = new Date(task.completedAt!).toISOString().slice(0, 10)
    dayCounts[day] = (dayCounts[day] || 0) + 1
  }
  const avgTasksPerDay = Object.values(dayCounts).length
    ? (completed.length / Object.values(dayCounts).length).toFixed(1)
    : "0"

  const bestDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
  const bestDayFormatted = bestDay
    ? new Date(bestDay).toLocaleDateString("en-US", {
        weekday: "long",
      })
    : "-"

  // --- Focus time
  const totalPomodoros = pomodoros.length
  const focusMinutes = totalPomodoros * 25
  const avgPomodoroPerTask = completed.length
    ? (totalPomodoros / completed.length).toFixed(1)
    : "0"

  // --- Goal Progress
  const goalTasks = tasks.filter((t) => t.linkedGoal === activeGoalId)
  const completedGoalTasks = goalTasks.filter((t) => t.completedAt)
  const goalProgressPct = goalTasks.length
    ? Math.round((completedGoalTasks.length / goalTasks.length) * 100)
    : 0

  const daysToFinishGoal =
    goalTasks.length && Object.values(dayCounts).length
      ? Math.ceil(
          (goalTasks.length - completedGoalTasks.length) /
            (completed.length / Object.values(dayCounts).length)
        )
      : "-"

  const activeGoal = goals.find((g) => g.id === activeGoalId)

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      {/* On Track */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>On track</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {onTrackPct}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {avgTasksPerDay} tasks/day
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Best day: {bestDayFormatted}
          </div>
          <div className="text-muted-foreground">
            {completed.length} completed
          </div>
        </CardFooter>
      </Card>

      {/* Focus Time */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Focus time</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatTime(focusMinutes)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              Avg time/task: {(Number(avgPomodoroPerTask) * 25).toFixed(0)}m
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium">
            {totalPomodoros} Pomodoro sessions logged
          </div>
          <div className="text-muted-foreground">25m focus blocks</div>
        </CardFooter>
      </Card>

      {/* Goal Progress */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            {activeGoal ? activeGoal.title : "Goal"}
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {goalProgressPct}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              Est. days left: {daysToFinishGoal}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium">Goal tracking active</div>
          <div className="text-muted-foreground">
            Based on current task pace
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
