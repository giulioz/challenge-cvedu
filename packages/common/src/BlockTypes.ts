export type IOPort<TPortInfo> =
  | ({ ut: "template" } & IOPortTemplate<TPortInfo>)
  | ({ ut: "inst" } & IOPortInst<TPortInfo>);
export type IOPortTemplate<TPortInfo> = {
  label: string;
  type: "input" | "output";
} & TPortInfo;
export type IOPortInst<TPortInfo> = IOPortTemplate<TPortInfo> & {
  blockUuid: string;
  blockName: string;
};
export type BlockTemplate<
  TBlockInfo,
  TPortInfo,
  TPortType = IOPortTemplate<TPortInfo>
> = {
  type: string;
  inputs: TPortType[];
  outputs: TPortType[];
  color?: string;
  customRenderer?: (
    block: Block<TBlockInfo, TPortInfo>,
    customParams: any
  ) => JSX.Element;
} & TBlockInfo;

export type PosObject = { x: number; y: number };

export type Block<TBlockInfo, TPortInfo> = BlockTemplate<
  TBlockInfo,
  IOPortInst<TPortInfo>
> & {
  uuid: string;
};

export type Link<TPortInfo> = {
  src: IOPortInst<TPortInfo>;
  dst: IOPortInst<TPortInfo> | null;

  ax?: number;
  ay?: number;
  bx?: number;
  by?: number;
};
