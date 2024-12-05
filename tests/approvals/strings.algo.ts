import { Contract } from '@algorandfoundation/algorand-typescript'

class StringContract extends Contract {
  join(a: string, b: string): string {
    return a + b
  }

  interpolate(a: string): string {
    return `You interpolated ${a}`
  }
}
