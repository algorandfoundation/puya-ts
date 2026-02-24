/**
 * Example 10 — Object Tuples
 * Tier: 2 — State & Data
 *
 * Features demonstrated:
 *   - Named type aliases for object shapes
 *   - Object destructuring (in assignments and parameters)
 *   - Objects as method params and return values
 *   - Objects in GlobalState
 *   - Returning objects from @readonly methods
 *   - Nested object types
 *   - Spread operator for object copying
 *   - clone() for deep copies
 */
import type { uint64 } from '@algorandfoundation/algorand-typescript'
// Contract: ABI-routed base; abimethod: decorator for create; readonly: non-mutating methods;
// assert/assertMatch: runtime checks; clone: deep copy; GlobalState: on-chain state
import { abimethod, assert, assertMatch, clone, Contract, GlobalState, readonly } from '@algorandfoundation/algorand-typescript'

// Named type alias — defines a reusable object shape for a 2D vector
type Vector = { x: uint64; y: uint64 }

// Named type alias — a labeled point with a name and coordinates
type LabeledPoint = { label: string; x: uint64; y: uint64 }

// Named type alias — nested objects compose larger structures
type Segment = { start: Vector; end: Vector }

// Free subroutine: accepts an object param and returns an object
function addVectors(a: Vector, b: Vector): Vector {
  // Arithmetic on uint64 fields requires type annotation
  const x: uint64 = a.x + b.x
  const y: uint64 = a.y + b.y
  // Return an object literal matching the Vector type alias
  return { x, y }
}

// Free subroutine: destructures an object parameter inline
function vectorMagnitudeSquared({ x, y }: Vector): uint64 {
  // Destructured fields x and y are available directly
  const result: uint64 = x * x + y * y
  return result
}

// Exported contract demonstrating object tuples: type aliases, destructuring, params/returns, state
export class ObjectTuples extends Contract {
  // GlobalState storing an object type — persists a Vector on-chain
  savedVector = GlobalState<Vector>()

  // GlobalState storing a nested object type
  savedSegment = GlobalState<Segment>()

  // createApplication: called once when the app is first deployed
  @abimethod({ allowActions: 'NoOp', onCreate: 'require' })
  public createApplication(): void {
    // Initialize GlobalState with an object literal
    this.savedVector.value = { x: 0, y: 0 }
    // Initialize nested object GlobalState
    this.savedSegment.value = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } }
  }

  // Objects as method params and return — accepts two Vectors, returns their sum
  public add(v1: Vector, v2: Vector): Vector {
    // Delegate to free subroutine that takes and returns objects
    return addVectors(v1, v2)
  }

  // Object destructuring in a method body
  public destructureExample(v: Vector): uint64 {
    // Destructure object into named variables
    const { x, y } = v
    // Use destructured fields directly
    const sum: uint64 = x + y
    return sum
  }

  // Destructured object parameter — fields extracted inline in the signature
  public destructuredParam({ x, y }: Vector): uint64 {
    // x and y are directly available from the destructured param
    const product: uint64 = x * y
    return product
  }

  // Nested object as param — Segment contains two Vectors
  public segmentLength(seg: Segment): uint64 {
    // Access nested object fields via dot notation
    const dx: uint64 = seg.end.x - seg.start.x
    const dy: uint64 = seg.end.y - seg.start.y
    // Return squared distance (no sqrt on uint64)
    const distSq: uint64 = dx * dx + dy * dy
    return distSq
  }

  // Store an object in GlobalState
  public saveVector(v: Vector): void {
    // clone() required when assigning a mutable object param to GlobalState
    this.savedVector.value = clone(v)
  }

  // Store a nested object in GlobalState
  public saveSegment(s: Segment): void {
    // clone() required — mutable object params must be copied before storing
    this.savedSegment.value = clone(s)
  }

  // @readonly — return object from state without mutating
  @readonly
  public getSavedVector(): Vector {
    // Read object from GlobalState and return it
    return clone(this.savedVector.value)
  }

  // @readonly — return nested object from state
  @readonly
  public getSavedSegment(): Segment {
    // Clone nested object before returning
    return clone(this.savedSegment.value)
  }

  // Spread operator and clone for object copying
  public testCopyAndMutate(v: Vector, newX: uint64): Vector {
    // clone() creates a deep copy — mutations won't affect the original
    const copy: Vector = clone(v)
    // Mutate the copy's field
    copy.x = newX
    // Assert original is unchanged
    assert(v.x !== newX, 'original should be unchanged')
    return copy
  }

  // Spread operator to create a new object from an existing one
  public testSpread(v: Vector): Vector {
    // Spread copies all fields into a new object literal
    const copy = { ...v }
    // Verify fields match using assertMatch
    assertMatch(copy, v)
    return copy
  }

  // Demonstrate free subroutine with destructured object param
  public magnitudeSquared(v: Vector): uint64 {
    // Calls free subroutine that destructures the Vector param
    return vectorMagnitudeSquared(v)
  }

  // Returning a LabeledPoint — object with mixed field types (string + uint64)
  public createLabeledPoint(label: string, x: uint64, y: uint64): LabeledPoint {
    // Construct and return an object with string and uint64 fields
    return { label, x, y }
  }

  // Accept a LabeledPoint and extract its label
  @readonly
  public getLabel(p: LabeledPoint): string {
    // Access string field from object param
    return p.label
  }
}
