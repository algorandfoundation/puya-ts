import * as pathe from 'pathe'

export class AbsolutePath {
  constructor(private value: string) {}

  static resolve({ path, workingDirectory }: { path: string; workingDirectory?: AbsolutePath }) {
    const p = pathe.resolve(workingDirectory?.value ?? process.cwd(), path)

    return new AbsolutePath(p)
  }

  toString() {
    return this.value
  }

  basename(ext?: string) {
    return pathe.basename(this.value, ext)
  }

  replaceAll(searchValue: string, replaceValue: string) {
    return new AbsolutePath(this.value.replaceAll(searchValue, replaceValue))
  }

  join(...paths: string[]) {
    return new AbsolutePath(pathe.join(this.value, ...paths))
  }

  equals(other: AbsolutePath | string) {
    return getAbsolutePath(other).value === this.value
  }

  relativeTo(other: AbsolutePath | string) {
    return pathe.relative(getAbsolutePath(other).value, this.value)
  }
}

function getAbsolutePath(path: AbsolutePath | string) {
  if (typeof path === 'string') {
    return AbsolutePath.resolve({ path })
  }
  return path
}
