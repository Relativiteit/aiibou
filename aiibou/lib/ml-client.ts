import * as Comlink from "comlink"

export interface MLWorker {
  init: () => Promise<boolean>
  embed: (text: string) => Promise<number[]>
  similarity: (a: number[], b: number[]) => Promise<number>
}

const worker = new Worker(new URL("../app/worker.ts", import.meta.url), {
  type: "module",
})

const api = Comlink.wrap<MLWorker>(worker)

export default api
