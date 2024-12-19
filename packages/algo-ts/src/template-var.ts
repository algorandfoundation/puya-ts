import { NoImplementation } from './impl/errors'

export function TemplateVar<T>(variableName: string, prefix = 'TMPL_'): T {
  throw NoImplementation
}
