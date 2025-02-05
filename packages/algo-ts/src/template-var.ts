import { NoImplementation } from './internal/errors'

export function TemplateVar<T>(variableName: string, prefix = 'TMPL_'): T {
  throw new NoImplementation()
}
