import { pipeline, FeatureExtractionPipeline } from "@xenova/transformers"
import type { Goal } from "@/components/ui/goal-store"

let extractor: FeatureExtractionPipeline | null = null

// Load model once when worker starts
async function loadModel() {
  const start = performance.now()
  try {
    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    ) as FeatureExtractionPipeline

    const duration = ((performance.now() - start) / 1000).toFixed(2)
    console.log(`[LLM Worker] Model loaded in ${duration}s`)
    self.postMessage({ type: "ready" })
  } catch (err) {
    console.error("[LLM Worker] Model load failed:", err)
    self.postMessage({ type: "error", error: err })
  }
}

// Mean pooling helper
function meanPool(tensor: number[][]): number[] {
  if (tensor.length === 0 || tensor[0].length === 0) {
    console.warn("[LLM Worker] ⚠️ Empty tensor received for mean pooling.")
    return []
  }

  const length = tensor.length
  const dim = tensor[0].length
  const pooled = new Array(dim).fill(0)

  for (let i = 0; i < length; i++) {
    for (let j = 0; j < dim; j++) {
      pooled[j] += tensor[i][j]
    }
  }

  return pooled.map((x) => x / length)
}

// Cosine similarity helper
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    console.warn(`[LLM Worker] ❌ Embedding length mismatch: ${a.length} ${b.length}`)
    return 0
  }

  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0)
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0))
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0))
  return dot / (normA * normB)
}

// Message handler
self.onmessage = async (event) => {
  const { type, task, goals, threshold = 0.5 } = event.data

  if (type === "prioritize") {
    if (!extractor) {
      await loadModel()
      self.postMessage({ type: "retry", task })
      return
    }

    try {
      if (typeof task.title !== "string") {
        throw new Error("Task title is not a string")
      }

      console.log(`[LLM Worker] Prioritizing: "${task.title}"`)
      const output = await extractor(task.title)
    
      const taskEmbedding = meanPool(output.data as number[][])

      const goalEmbeddings: number[][] = await Promise.all(
        goals.map(async (g: Goal) => {
          const result = await extractor!(g.title)
          return meanPool(result.data as number[][])
        })
      )
      
      let bestScore = 0
      let bestId: string | null = null

      for (let i = 0; i < goals.length; i++) {
        const score = cosineSimilarity(taskEmbedding, goalEmbeddings[i])
        console.log(`[LLM Worker] → "${goals[i].title}" = ${score.toFixed(4)}`)
      
        if (score > bestScore) {
          bestScore = score
          bestId = goals[i].id
        }
      }

      self.postMessage({
        type: "result",
        task,
        bestId: bestScore > threshold ? bestId : null,
      })
    } catch (err) {
      console.error("[LLM Worker] Error during prioritization:", err)
      self.postMessage({ type: "error", error: err })
    }
  }
}

// Initial load
loadModel()
