/**
 * Example 02: Greeter
 *
 * This example demonstrates string handling and @readonly methods.
 *
 * Features:
 * - string params & returns
 * - @readonly decorator
 * - JSDoc comments on methods
 * - Template literals
 *
 * Prerequisites: LocalNet
 *
 * @note Educational only — not audited for production use.
 */
// Contract: ABI-routed base class; readonly: marks method as non-mutating
import { Contract, readonly } from '@algorandfoundation/algorand-typescript'

// Simple greeter contract demonstrating string handling and @readonly methods
// example: GREETER
export class Greeter extends Contract {
  /** Called once when the app is first deployed. */
  public createApplication(): void {}

  /**
   * Greet a person by name.
   * @param name - The name of the person to greet
   * @returns A personalised greeting string
   */
  @readonly // Marks this method as non-mutating (can be called via simulate)
  public greet(name: string): string {
    // Template literal: interpolates the name param into a greeting string
    return `Hello, ${name}!`
  }

  /**
   * Greet two people at once.
   * @param firstName - The first person's name
   * @param lastName - The second person's name
   * @returns A greeting addressing both people
   */
  @readonly // @readonly is shorthand for @abimethod({ readonly: true })
  public greetTwo(firstName: string, lastName: string): string {
    // Template literal with multiple string params interpolated
    return `Hello, ${firstName} and ${lastName}!`
  }
}
// example: GREETER
