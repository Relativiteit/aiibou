import { Card, CardContent } from "@/components/ui/card"

import { Task } from "@/types/task"

export function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <Card>
      <CardContent className="p-3 space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex justify-between text-sm border-b last:border-none pb-1"
          >
            <span>{task.title}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(task.createdAt).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
