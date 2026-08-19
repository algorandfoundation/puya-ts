import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { arc4, abimethod, assert, Contract, urange, Uint64 } from '@algorandfoundation/algorand-typescript'

export class IfElseExample extends Contract {
  // example: IF_ELSE
  @abimethod()
  isRich(accountBalance: uint64): string {
    if (accountBalance > 1000) {
      return 'This account is rich!'
    }
    if (accountBalance > 100) {
      return 'This account is doing well.'
    }
    return 'This account is poor :('
  }

  // example: IF_ELSE

  // example: TERNARY
  @abimethod()
  isEven(number: uint64): string {
    return number % 2 === 0 ? 'Even' : 'Odd'
  }

  // example: TERNARY
}

// example: FOR_LOOP
type FourArray = arc4.StaticArray<arc4.Uint8, 4>

export class ForLoopsExample extends Contract {
  @abimethod()
  forLoop(): FourArray {
    const array = new arc4.StaticArray(new arc4.Uint8(0), new arc4.Uint8(0), new arc4.Uint8(0), new arc4.Uint8(0))

    for (const index of urange(4)) {
      array[index] = new arc4.Uint8(Uint64(3) - index)
    }

    let x = Uint64(0)
    for (const item of urange(1, 5)) {
      x += item
    }

    assert(x === 10)
    return array
  }
}

// example: FOR_LOOP

// example: MATCH
export class MatchStatements extends Contract {
  @abimethod()
  getDay(day: uint64): string {
    switch (day) {
      case 0:
        return 'Monday'
      case 1:
        return 'Tuesday'
      case 2:
        return 'Wednesday'
      case 3:
        return 'Thursday'
      case 4:
        return 'Friday'
      case 5:
        return 'Saturday'
      case 6:
        return 'Sunday'
      default:
        return 'Invalid day'
    }
  }
}

// example: MATCH

// example: WHILE_LOOP
export class WhileLoopExample extends Contract {
  @abimethod()
  loop(): uint64 {
    let num = Uint64(10)
    let loopCount = Uint64(0)

    while (num > 0) {
      if (num > 5) {
        num -= 1
        loopCount += 1
        continue
      }

      num -= 2
      loopCount += 1

      if (num === 1) {
        break
      }
    }

    return loopCount
  }
}

// example: WHILE_LOOP
