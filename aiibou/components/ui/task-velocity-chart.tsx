"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useTaskStore } from "@/components/ui/task-store"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

const chartConfig = {
  tasks: { label: "Tasks" },
  total: { label: "Total Tasks", color: "var(--primary)" },
  aligned: { label: "Goal-Aligned", color: "var(--secondary)" },
} satisfies ChartConfig

function groupTasksByDay(tasks: ReturnType<typeof useTaskStore.getState>["tasks"]) {
  const counts: Record<string, { total: number; aligned: number }> = {}

  tasks.forEach((task) => {
    if (!task.completedAt) return

    const date = new Date(task.completedAt).toISOString().slice(0, 10) // "YYYY-MM-DD"

    if (!counts[date]) {
      counts[date] = { total: 0, aligned: 0 }
    }

    counts[date].total += 1
    if (task.linkedGoal) counts[date].aligned += 1
  })

  return Object.entries(counts)
    .map(([date, count]) => ({ date, ...count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export function TaskVelocityChart() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("7d")
  const tasks = useTaskStore((state) => state.tasks)
  const groupedData = groupTasksByDay(tasks)

  const daysToShow = timeRange === "90d" ? 90 : timeRange === "30d" ? 30 : 7
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - daysToShow)

  const filteredData = groupedData.filter(
    (d) => new Date(d.date) >= cutoff
  )

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Task Completion Velocity</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Last {daysToShow} days — Total vs Aligned
          </span>
          <span className="@[540px]/card:hidden">
            Last {daysToShow} days
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="flex w-40 @[767px]/card:hidden" size="sm">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-total)" stopOpacity={1} />
                <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillAligned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-aligned)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-aligned)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : filteredData.length - 1}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="aligned"
              type="natural"
              fill="url(#fillAligned)"
              stroke="var(--color-aligned)"
              stackId="a"
            />
            <Area
              dataKey="total"
              type="natural"
              fill="url(#fillTotal)"
              stroke="var(--color-total)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
