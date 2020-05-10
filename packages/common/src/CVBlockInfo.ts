export type CVBlockInfo = {
  hardcoded?: boolean;
  code?: string;
  solution?: string;
  solutionPassword?: string;
  fn?: any;
  customInput?: boolean;
};

export type CVValueType =
  | "string"
  | "number"
  | "imagedata"
  | "mask"
  | "accumulator";

export type CVIOPortInfo = {
  valueType: CVValueType;
};
