import React from "react";

import {
  CVBlockInfo,
  CVIOPortInfo,
} from "@challenge-cvedu/common/src/CVBlockInfo";
import {
  NumberInputHelper,
  UVInputHelper,
  FrameInputHelper,
} from "./components/InputHelpers";
import { Block, BlockTemplate } from "@challenge-cvedu/common";

export const templatesInitial: BlockTemplate<CVBlockInfo, CVIOPortInfo>[] = [
  {
    type: "CameraInput",
    hardcoded: true,
    customInput: false,
    color: "#422828",
    inputs: [],
    outputs: [
      {
        label: "Frame",
        type: "output" as const,
        valueType: "imagedata" as const,
      },
    ],
  },

  {
    type: "NumericInput",
    hardcoded: true,
    customInput: true,
    color: "#423f28",
    customRenderer: (
      block: Block<CVBlockInfo, CVIOPortInfo>,
      {
        customValues,
        setCustomValues,
      }: {
        customValues: { [key: string]: any };
        setCustomValues: (
          fn: (old: { [key: string]: any }) => { [key: string]: any }
        ) => void;
      }
    ) => (
      <NumberInputHelper
        customValues={customValues}
        setCustomValues={setCustomValues}
        block={block}
        minValue={0}
        maxValue={30}
        step={0.01}
      />
    ),
    inputs: [],
    outputs: [
      {
        label: "Number",
        type: "output" as const,
        valueType: "number" as const,
      },
    ],
  },

  {
    type: "UVInput",
    hardcoded: true,
    customInput: true,
    color: "#423f28",
    customRenderer: (
      block: Block<CVBlockInfo, CVIOPortInfo>,
      {
        customValues,
        setCustomValues,
      }: {
        customValues: { [key: string]: any };
        setCustomValues: (
          fn: (old: { [key: string]: any }) => { [key: string]: any }
        ) => void;
      }
    ) => (
      <UVInputHelper
        customValues={customValues}
        setCustomValues={setCustomValues}
        block={block}
      />
    ),
    inputs: [],
    outputs: [
      {
        label: "U",
        type: "output" as const,
        valueType: "number" as const,
      },
      {
        label: "V",
        type: "output" as const,
        valueType: "number" as const,
      },
    ],
  },

  {
    type: "FrameInput",
    hardcoded: true,
    customInput: true,
    color: "#423f28",
    customRenderer: (
      block: Block<CVBlockInfo, CVIOPortInfo>,
      {
        customValues,
        setCustomValues,
      }: {
        customValues: { [key: string]: any };
        setCustomValues: (
          fn: (old: { [key: string]: any }) => { [key: string]: any }
        ) => void;
      }
    ) => (
      <FrameInputHelper
        customValues={customValues}
        setCustomValues={setCustomValues}
        block={block}
      />
    ),
    inputs: [],
    outputs: [
      {
        label: "Frame",
        type: "output" as const,
        valueType: "imagedata" as const,
      },
    ],
  },

  {
    type: "DisplayFrame",
    hardcoded: true,
    customInput: false,
    color: "#284042",
    inputs: [
      {
        label: "Frame",
        type: "input" as const,
        valueType: "imagedata" as const,
      },
    ],
    outputs: [],
  },
];
