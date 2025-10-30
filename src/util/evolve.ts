/**
 * Given a target object that is an instance of a class, return a clone of that object but with
 * updated values for the properties specified in newProperties. Target properties cannot be 'get' only,
 * but can be attributed `readonly`
 * @param target The target object to clone
 * @param newProperties New property values to assign to the cloned object
 */
export function evolve<T extends object>(target: T, newProperties: Partial<T>): T {
  const clone = Object.create(Object.getPrototypeOf(target))
  return Object.assign(clone, target, newProperties)
}
