import path from 'node:path'
import * as fs from 'node:fs'
import { logger } from './logger'

export enum ArtifactKind {
  Awst,
  AwstJson,
}

function mkDirIfNotExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export function writeArtifact<TObj>({
  sourceFile,
  outDir,
  kind,
  obj,
  buildArtifact,
}: {
  sourceFile: string
  outDir: string
  kind: ArtifactKind
  artifactName?: string
  buildArtifact(obj: TObj): string
  obj: TObj
}) {
  const outDirectory = path.resolve(path.dirname(sourceFile), outDir)
  let outFilePath: string
  switch (kind) {
    case ArtifactKind.Awst:
      outFilePath = path.join(outDirectory, `${path.basename(sourceFile, '.algo.ts')}.awst`)
      break
    case ArtifactKind.AwstJson:
      outFilePath = path.join(outDirectory, `${path.basename(sourceFile, '.algo.ts')}.awst.json`)
      break
  }

  const content = buildArtifact(obj)
  logger.info(undefined, `Writing ${outFilePath}`)
  mkDirIfNotExists(path.dirname(outFilePath))
  fs.writeFileSync(outFilePath, content, 'utf-8')
}
