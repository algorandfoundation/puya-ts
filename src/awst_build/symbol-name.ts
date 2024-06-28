export class SymbolName {
  public readonly module: string
  public readonly name: string

  constructor(props: { module: string; name: string }) {
    this.module = props.module
    this.name = props.name
  }

  get fullName() {
    return `${this.module}::${this.name}`
  }

  toString() {
    return this.fullName
  }
}
