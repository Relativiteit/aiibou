import { pipeline, FeatureExtractionPipeline } from "@xenova/transformers"

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

// Similarity
function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0)
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0))
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0))
  return dot / (normA * normB)
}

// Task handler
self.onmessage = async (event) => {
  const { type, task, goals, threshold = 0.5 } = event.data

  if (type === "prioritize") {
    if (!extractor) {
      await loadModel()
      // After load, retry the same message
      self.postMessage({ type: "retry", task })
      return
    }

    try {
      const taskEmbedding = (await extractor(task.title)).data[0] as number[]

      const goalEmbeddings = await Promise.all(
        goals.map(async (g: { title: string }) =>
          (await extractor!(g.title)).data[0] as number[]
        )
      )

      let bestScore = 0
      let bestId: string | null = null

      for (let i = 0; i < goals.length; i++) {
        const score = cosineSimilarity(taskEmbedding, goalEmbeddings[i])
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

// Kick off model load immediately
loadModel()
