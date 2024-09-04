export class NotImplementedError extends Error {
  constructor(feature: string) {
    super(`${feature} is not available in test context. Mock using your preferred testing framework.`)
  }
}

export function notImplementedError(feature: string): never {
  throw new NotImplementedError(feature)
}
