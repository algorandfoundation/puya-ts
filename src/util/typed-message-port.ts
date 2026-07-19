import type { Transferable, Worker } from 'node:worker_threads'
import type { MessagePort } from 'worker_threads'

export type TypedMessagePort<TPost, TReceive> = {
  postMessage(message: TPost, transfer?: Transferable[]): void
  onMessage(listener: (message: TReceive) => void): Disposable
}

export function createTypedMessagePort<TPost = never, TReceive = never>(x: MessagePort | Worker): TypedMessagePort<TPost, TReceive> {
  return {
    postMessage(message: TPost, transfer) {
      x.postMessage(message, transfer ?? [])
    },
    onMessage(listener: (message: TReceive) => void) {
      x.on('message', listener)
      return {
        [Symbol.dispose]() {
          x.off('message', listener)
        },
      }
    },
  }
}
