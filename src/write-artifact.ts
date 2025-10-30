import * as fs from 'node:fs'
import pathe from 'pathe'
import { logger } from './logger'
import { mkDirIfNotExists } from './util'
import type { AbsolutePath } from './util/absolute-path'

export enum ArtifactKind {
  Awst,
  AwstJson,
}

export function writeArtifact<TObj>({
  sourceFile,
  outDir,
  kind,
  obj,
  buildArtifact,
}: {
  sourceFile: AbsolutePath
  outDir: AbsolutePath
  kind: ArtifactKind
  artifactName?: string
  buildArtifact(obj: TObj): string
  obj: TObj
}) {
  let outFilePath: string
  switch (kind) {
    case ArtifactKind.Awst:
      outFilePath = outDir.join(`${sourceFile.basename('.algo.ts')}.awst`).toString()
      break
    case ArtifactKind.AwstJson:
      outFilePath = outDir.join(`${sourceFile.basename('.algo.ts')}.awst.json`).toString()
      break
  }

  const content = buildArtifact(obj)
  logger.info(undefined, `Writing ${outFilePath}`)
  mkDirIfNotExists(pathe.dirname(outFilePath))
  fs.writeFileSync(outFilePath, content, 'utf-8')
}
