import { nodeFactory } from '../awst/node-factory'
import type { ARC4MethodConfig } from '../awst/nodes'
import { ARC4ABIMethodConfig } from '../awst/nodes'
import type { SourceLocation } from '../awst/source-location'
import { wtypes } from '../awst/wtypes'
import { logger } from '../logger'
import { codeInvariant, invariant } from '../util'
import { AwstBuildContext } from './context/awst-build-context'
import type { FunctionPType } from './ptypes'

export function arc4ConfigFromType(functionType: FunctionPType, sourceLocation: SourceLocation) {
  codeInvariant(
    functionType.declaredIn,
    `${functionType.name} does not appear to be a contract method. Ensure you are calling a function defined on a contract class eg. abiCall<typeof YourContract.prototype.yourMethod>`,
    sourceLocation,
  )

  const contractType = AwstBuildContext.current.getContractTypeByName(functionType.declaredIn)
  invariant(contractType, `${functionType.declaredIn} has not been visited`)

  const arc4Config = AwstBuildContext.current.getArc4Config(contractType, functionType.name)
  codeInvariant(
    arc4Config instanceof ARC4ABIMethodConfig,
    `${functionType.name} is not an ABI method. Only ABI compatible methods can be called with this helper.`,
    sourceLocation,
  )
  const methodSelector = buildArc4MethodConstant(functionType, arc4Config, sourceLocation)
  return {
    arc4Config,
    methodSelector,
  }
}

/**
 * Generate a methodConstant node for the given function, making use of the ARC4ABIMethodConfig
 * @param functionType The function ptype
 * @param arc4Config ARC4 method config
 * @param sourceLocation The source location of the code generating the constant,
 */
export function buildArc4MethodConstant(functionType: FunctionPType, arc4Config: ARC4ABIMethodConfig, sourceLocation: SourceLocation) {
  const methodSignature = nodeFactory.methodSignature({
    name: arc4Config.name,
    argTypes: functionType.parameters.map(([_, ptype]) => ptype.wtypeOrThrow),
    returnType: functionType.returnType.wtypeOrThrow,
    resourceEncoding: arc4Config.resourceEncoding,
    sourceLocation,
  })
  return nodeFactory.methodConstant({
    value: methodSignature,
    wtype: new wtypes.BytesWType({ length: 4n }),
    sourceLocation,
  })
}

/**
 * Reports each way an implementation would change the selector w.r.t. the abstract declaration of a public function.
 * Routing options such as `allowActions` and `onCreate` may still differ
 */
export function checkAbstractAbiImplementation({
  declaration,
  implementation,
  sourceLocation,
}: {
  declaration: { name: string; type: FunctionPType; config: ARC4ABIMethodConfig }
  implementation: { name: string; type: FunctionPType; config: ARC4MethodConfig | null | undefined }
  sourceLocation: SourceLocation
}) {
  const { config } = implementation
  if (!(config instanceof ARC4ABIMethodConfig)) {
    logger.error(sourceLocation, `${implementation.name} must be an ABI method to match the abstract ABI method ${declaration.name}`)
    return
  }
  if (config.name !== declaration.config.name) {
    logger.error(
      sourceLocation,
      `${implementation.name} must keep the ABI name '${declaration.config.name}' of the abstract ABI method ${declaration.name}, but it uses '${config.name}'`,
    )
  }
  if (config.resourceEncoding !== declaration.config.resourceEncoding) {
    logger.error(
      sourceLocation,
      `${implementation.name} must keep the resource encoding '${declaration.config.resourceEncoding}' of the abstract ABI method ${declaration.name}, but it uses '${config.resourceEncoding}'`,
    )
  }
  const expected = declaration.type.parameters
  const actual = implementation.type.parameters
  if (actual.length !== expected.length || actual.some(([, t], i) => !t.wtypeOrThrow.hasSameStructure(expected[i][1].wtypeOrThrow))) {
    logger.error(sourceLocation, `${implementation.name} must keep the parameter types of the abstract ABI method ${declaration.name}`)
  }
  if (!implementation.type.returnType.wtypeOrThrow.hasSameStructure(declaration.type.returnType.wtypeOrThrow)) {
    logger.error(sourceLocation, `${implementation.name} must keep the return type of the abstract ABI method ${declaration.name}`)
  }
}
