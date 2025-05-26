import type { Task } from "@/components/ui/task-store"
import type { Goal } from "@/components/ui/goal-store"

let worker: Worker 
let readyPromise: Promise<void> | null = null

function ensureWorker(): Worker {
  if (!worker) {
    console.log("[Agent] Starting worker thread...")
    worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" })

    // Send init
    worker.postMessage({ type: "init" })

    readyPromise = new Promise((resolve) => {
      const listener = (e: MessageEvent) => {
        if (e.data?.type === "ready") {
          worker?.removeEventListener("message", listener)
          console.log("[Agent] ✅ Worker ready!")
          resolve()
        }
      }
      worker.addEventListener("message", listener)
    })
  }

  return worker
}

export async function waitUntilModelReady(): Promise<void> {
  ensureWorker()
  return readyPromise!
}

export async function autoLinkTasksToGoals(
  tasks: Task[],
  goals: Goal[]
): Promise<Record<string, string | null>> {
  const worker = ensureWorker()

  return new Promise((resolve, reject) => {
    const results: Record<string, string | null> = {}
    const listener = (e: MessageEvent) => {
      if (e.data?.type === "result") {
        results[e.data.task.id] = e.data.bestId

        if (Object.keys(results).length === tasks.length) {
          worker.removeEventListener("message", listener)
          resolve(results)
        }
      } else if (e.data?.type === "error") {
        reject(e.data.error)
      }
    }

    worker.addEventListener("message", listener)

    for (const task of tasks) {
      worker.postMessage({
        type: "prioritize",
        task,
        goals,
      })
    }
  })
}
