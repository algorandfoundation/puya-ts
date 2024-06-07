export interface LangSpec {
  ops: { [key: string]: Op };
  arg_enums: ArgEnum;
}

export interface Op {
  name: string;
  size: number;
  doc: string[];
  cost: Cost;
  min_avm_version: number;
  halts: boolean;
  mode: string;
  groups: string[];
  stack_inputs: StackInputOutput[];
  immediate_args: ImmediateArg[];
  stack_outputs: StackInputOutput[];
}

export interface Cost {
  value: number | null;
  doc: string;
}

export interface ImmediateArg {
  name: string;
  immediate_type: string;
  arg_enum: string | null;
  modifies_stack_input: number | null;
  modifies_stack_output: number | null;
  doc: string;
}

export interface StackInputOutput {
  name: string;
  stack_type: string;
  doc: string[] | null;
}

export interface ArgEnum {
  [key: string]: ArgEnumValue[]
}

export interface ArgEnumValue {
  name: string;
  doc: string | null;
  stack_type: string | null;
  mode: string;
}
