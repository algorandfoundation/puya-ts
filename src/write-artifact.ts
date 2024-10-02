import * as fs from 'node:fs'
import upath from 'upath'
import { logger } from './logger'

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
  sourceFile: string
  outDir: string
  kind: ArtifactKind
  artifactName?: string
  buildArtifact(obj: TObj): string
  obj: TObj
}) {
  let outFilePath: string
  switch (kind) {
    case ArtifactKind.Awst:
      outFilePath = upath.join(outDir, `${upath.basename(sourceFile, '.algo.ts')}.awst`)
      break
    case ArtifactKind.AwstJson:
      outFilePath = upath.join(outDir, `${upath.basename(sourceFile, '.algo.ts')}.awst.json`)
      break
  }

  const content = buildArtifact(obj)
  logger.info(undefined, `Writing ${outFilePath}`)
  fs.writeFileSync(outFilePath, content, 'utf-8')
}
