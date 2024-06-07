import path from 'node:path'
import * as fs from 'node:fs'

export enum ArtifactKind {
  Awst,
}

function mkDirIfNotExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export function writeArtifact<TObj extends { accept(x: TVisitor): string | string[] }, TVisitor>({
  sourceFile,
  outDir,
  kind,
  obj,
  visitor,
}: {
  sourceFile: string
  outDir: string
  kind: ArtifactKind
  artifactName?: string
  obj: TObj | TObj[]
  visitor: TVisitor
}) {
  const outDirectory = path.resolve(path.dirname(sourceFile), outDir)
  let outFilePath: string
  switch (kind) {
    case ArtifactKind.Awst:
      outFilePath = path.join(outDirectory, `${path.basename(sourceFile, '.algo.ts')}.awst`)
  }

  const content = Array.from([obj])
    .flat()
    .flatMap((o) => o.accept(visitor))
    .join('\n')
  mkDirIfNotExists(path.dirname(outFilePath))
  fs.writeFileSync(outFilePath, content, 'utf-8')
}
