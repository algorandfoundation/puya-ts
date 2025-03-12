export function debounce<T extends unknown[], U>(callback: (...args: T) => PromiseLike<U> | U, wait: number) {
  let timer: ReturnType<typeof setTimeout> | undefined

  return (...args: T): Promise<U> => {
    if (timer) clearTimeout(timer)

    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(callback(...args)), wait)
    })
  }
}
