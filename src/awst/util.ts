import { Block, Statement } from './nodes'
import { nodeFactory } from './node-factory'
import { SourceLocation } from './source-location'

export function wrapInBlock(statementOrStatements: Statement | Statement[], sourceLocation: SourceLocation): Block {
  if (Array.isArray(statementOrStatements)) {
    return nodeFactory.block({
      body: statementOrStatements,
      description: undefined,
      sourceLocation,
    })
  } else {
    if (statementOrStatements instanceof Block) {
      return statementOrStatements
    } else {
      return nodeFactory.block({
        sourceLocation,
        body: [statementOrStatements],
        description: undefined,
      })
    }
  }
}
