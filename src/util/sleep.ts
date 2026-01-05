export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Since node is single threaded (unless using workers) a long-running synchronous operation may hold up
 * processing of other events (such as changed files). Awaiting this function allows the currently executing
 * code to relinquish control of the thread whilst adding a continuation of this code to the event queue.
 */
export function relinquishThread(): Promise<void> {
  return sleep(1)
}
