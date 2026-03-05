/**
 * Example 08: Object Tuples
 *
 * This example demonstrates objects as method params, return values, and state.
 *
 * Features:
 * - Named type aliases for object shapes
 * - Object destructuring (in assignments and parameters)
 * - Objects as method params and return values
 * - Objects in GlobalState
 * - Returning objects from @readonly methods
 * - Nested object types
 * - Spread operator for object copying
 * - clone() for deep copies
 *
 * Prerequisites: LocalNet
 *
 * @note Educational only — not audited for production use.
 */
import type { uint64 } from '@algorandfoundation/algorand-typescript'
// Contract: ABI-routed base; readonly: non-mutating methods;
// assert/assertMatch: runtime checks; clone: deep copy; GlobalState: on-chain state
import { assert, assertMatch, clone, Contract, GlobalState, readonly } from '@algorandfoundation/algorand-typescript'

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
// example: OBJECT_TUPLES
export class ObjectTuples extends Contract {
  // GlobalState storing an object type — persists a Vector on-chain
  savedVector = GlobalState<Vector>()

  // GlobalState storing a nested object type
  savedSegment = GlobalState<Segment>()

  /** Called once when the app is first deployed. */
  public createApplication(): void {
    // Initialize GlobalState with an object literal
    this.savedVector.value = { x: 0, y: 0 }
    // Initialize nested object GlobalState
    this.savedSegment.value = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } }
  }

  /**
   * Accepts two Vectors and returns their sum.
   * @param v1 - first vector
   * @param v2 - second vector
   * @returns the component-wise sum of v1 and v2
   */
  public add(v1: Vector, v2: Vector): Vector {
    // Delegate to free subroutine that takes and returns objects
    return addVectors(v1, v2)
  }

  /**
   * Object destructuring in a method body.
   * @param v - vector to destructure
   * @returns the sum of x and y components
   */
  public destructureExample(v: Vector): uint64 {
    // Destructure object into named variables
    const { x, y } = v
    // Use destructured fields directly
    const sum: uint64 = x + y
    return sum
  }

  /**
   * Destructured object parameter — fields extracted inline in the signature.
   * @param v - vector whose fields are destructured
   * @returns the product of x and y
   */
  public destructuredParam({ x, y }: Vector): uint64 {
    // x and y are directly available from the destructured param
    const product: uint64 = x * y
    return product
  }

  /**
   * Nested object as param — Segment contains two Vectors.
   * @param seg - segment with start and end vectors
   * @returns the squared distance between start and end
   */
  public segmentLength(seg: Segment): uint64 {
    // Access nested object fields via dot notation
    const dx: uint64 = seg.end.x - seg.start.x
    const dy: uint64 = seg.end.y - seg.start.y
    // Return squared distance (no sqrt on uint64)
    const distSq: uint64 = dx * dx + dy * dy
    return distSq
  }

  /**
   * Store an object in GlobalState.
   * @param v - vector to persist on-chain
   */
  public saveVector(v: Vector): void {
    // clone() required when assigning a mutable object param to GlobalState
    this.savedVector.value = clone(v)
  }

  /**
   * Store a nested object in GlobalState.
   * @param s - segment to persist on-chain
   */
  public saveSegment(s: Segment): void {
    // clone() required — mutable object params must be copied before storing
    this.savedSegment.value = clone(s)
  }

  /**
   * Return object from state without mutating.
   * @returns the saved vector from GlobalState
   */
  @readonly
  public getSavedVector(): Vector {
    // Read object from GlobalState and return it
    return clone(this.savedVector.value)
  }

  /**
   * Return nested object from state.
   * @returns the saved segment from GlobalState
   */
  @readonly
  public getSavedSegment(): Segment {
    // Clone nested object before returning
    return clone(this.savedSegment.value)
  }

  /**
   * Spread operator and clone for object copying.
   * @param v - original vector to copy
   * @param newX - new x value for the copy
   * @returns a mutated copy of the original vector
   */
  public testCopyAndMutate(v: Vector, newX: uint64): Vector {
    // clone() creates a deep copy — mutations won't affect the original
    const copy: Vector = clone(v)
    // Mutate the copy's field
    copy.x = newX
    // Assert original is unchanged
    assert(v.x !== newX, 'original should be unchanged')
    return copy
  }

  /**
   * Spread operator to create a new object from an existing one.
   * @param v - vector to spread-copy
   * @returns a new vector with the same field values
   */
  public testSpread(v: Vector): Vector {
    // Spread copies all fields into a new object literal
    const copy = { ...v }
    // Verify fields match using assertMatch
    assertMatch(copy, v)
    return copy
  }

  /**
   * Demonstrate free subroutine with destructured object param.
   * @param v - vector to compute magnitude squared for
   * @returns the squared magnitude (x*x + y*y)
   */
  public magnitudeSquared(v: Vector): uint64 {
    // Calls free subroutine that destructures the Vector param
    return vectorMagnitudeSquared(v)
  }

  /**
   * Return a LabeledPoint — object with mixed field types (string + uint64).
   * @param label - name for the point
   * @param x - x coordinate
   * @param y - y coordinate
   * @returns a new LabeledPoint with the given fields
   */
  public createLabeledPoint(label: string, x: uint64, y: uint64): LabeledPoint {
    // Construct and return an object with string and uint64 fields
    return { label, x, y }
  }

  /**
   * Accept a LabeledPoint and extract its label.
   * @param p - labeled point to read from
   * @returns the label string
   */
  @readonly
  public getLabel(p: LabeledPoint): string {
    // Access string field from object param
    return p.label
  }
}
// example: OBJECT_TUPLES
