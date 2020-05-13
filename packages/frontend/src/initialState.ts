import { Block, CVBlockInfo, CVIOPortInfo } from "@challenge-cvedu/common/";

// export const initialBlocks: Block<CVBlockInfo, CVIOPortInfo>[] = [
export const initialBlocks: any[] = [
  {
    type: "CameraInput",
    hardcoded: true,
    customInput: false,
    color: "#422828",
    inputs: [],
    outputs: [
      {
        label: "Frame",
        type: "output",
        valueType: "imagedata",
        blockUuid: "29f46a6c5736489b944ffbab574dfc9e",
        blockName: "CameraInput",
        ut: "inst",
      },
    ],
    fn: null,
    uuid: "29f46a6c5736489b944ffbab574dfc9e",
  },
  {
    type: "RGBtoYUV",
    hardcoded: false,
    customInput: false,
    inputs: [
      {
        label: "Frame",
        type: "input",
        valueType: "imagedata",
        blockUuid: "a0bc615083f048d3b16f5709c69696c2",
        blockName: "RGBtoYUV",
        ut: "inst",
      },
    ],
    outputs: [
      {
        label: "YUVFrame",
        type: "output",
        valueType: "imagedata",
        blockUuid: "a0bc615083f048d3b16f5709c69696c2",
        blockName: "RGBtoYUV",
        ut: "inst",
      },
    ],
    code:
      "function RGBtoYUV({ Frame }: { Frame: ImageData }): { YUVFrame: ImageData } {\n  // Copia i pixel dell'immagine\n  const newData = new ImageData(Frame.width, Frame.height);\n\n  // Per ogni pixel...\n  for (let i = 0; i < Frame.data.length; i += 4) {\n    // Estrae i valori di RGB\n    const R = Frame.data[i];\n    const G = Frame.data[i + 1];\n    const B = Frame.data[i + 2];\n\n    // Calcola i valori di YUV applicando una moltiplicazione matriciale\n    const Y = 0.257 * R + 0.504 * G + 0.098 * B + 16;\n    const U = -0.148 * R - 0.291 * G + 0.439 * B + 128;\n    const V = 0.439 * R - 0.368 * G - 0.071 * B + 128;\n\n    // Salva i valori di YUV sulla copia dell'immagine\n    newData.data[i] = Y;\n    newData.data[i + 1] = U;\n    newData.data[i + 2] = V;\n    newData.data[i + 3] = 255;\n  }\n\n  return { YUVFrame: newData };\n}\n",
    uuid: "a0bc615083f048d3b16f5709c69696c2",
  },
  {
    type: "ChromaKeyUV",
    hardcoded: false,
    customInput: false,
    inputs: [
      {
        label: "YUVFrame",
        type: "input",
        valueType: "imagedata",
        blockUuid: "6e58a29293d44eaaa49ccc32b14cf302",
        blockName: "ChromaKeyUV",
        ut: "inst",
      },
      {
        label: "pU",
        type: "input",
        valueType: "number",
        blockUuid: "6e58a29293d44eaaa49ccc32b14cf302",
        blockName: "ChromaKeyUV",
        ut: "inst",
      },
      {
        label: "pV",
        type: "input",
        valueType: "number",
        blockUuid: "6e58a29293d44eaaa49ccc32b14cf302",
        blockName: "ChromaKeyUV",
        ut: "inst",
      },
      {
        label: "radius",
        type: "input",
        valueType: "number",
        blockUuid: "6e58a29293d44eaaa49ccc32b14cf302",
        blockName: "ChromaKeyUV",
        ut: "inst",
      },
    ],
    outputs: [
      {
        label: "Mask",
        type: "output",
        valueType: "mask",
        blockUuid: "6e58a29293d44eaaa49ccc32b14cf302",
        blockName: "ChromaKeyUV",
        ut: "inst",
      },
    ],
    code:
      "function ChromaKeyUV({\n  YUVFrame,\n  pU,\n  pV,\n  radius,\n}: {\n  YUVFrame: ImageData;\n  pU: number;\n  pV: number;\n  radius: number;\n}): { Mask: { data: boolean[]; width: number; height: number } } {\n  // Crea una maschera vuota\n  const data = new Array<boolean>(YUVFrame.width * YUVFrame.height).fill(false);\n\n  // COMPLETA QUI\n\n  return { Mask: { data, width: YUVFrame.width, height: YUVFrame.height } };\n}\n",
    uuid: "6e58a29293d44eaaa49ccc32b14cf302",
  },
  {
    type: "UVInput",
    hardcoded: true,
    customInput: true,
    color: "#423f28",
    inputs: [],
    outputs: [
      {
        label: "U",
        type: "output",
        valueType: "number",
        blockUuid: "926160e6a81341f4a88338ad26c1e217",
        blockName: "UVInput",
        ut: "inst",
      },
      {
        label: "V",
        type: "output",
        valueType: "number",
        blockUuid: "926160e6a81341f4a88338ad26c1e217",
        blockName: "UVInput",
        ut: "inst",
      },
    ],
    fn: null,
    uuid: "926160e6a81341f4a88338ad26c1e217",
  },
  {
    type: "NumericInput",
    hardcoded: true,
    customInput: true,
    color: "#423f28",
    inputs: [],
    outputs: [
      {
        label: "Number",
        type: "output",
        valueType: "number",
        blockUuid: "6a2cd6372eda4744af2fa45624881dd2",
        blockName: "NumericInput",
        ut: "inst",
      },
    ],
    fn: null,
    uuid: "6a2cd6372eda4744af2fa45624881dd2",
  },
  {
    type: "ChromaComposite",
    hardcoded: false,
    customInput: false,
    inputs: [
      {
        label: "Mask",
        type: "input",
        valueType: "mask",
        blockUuid: "5c21025051e340278d6716d5736c7336",
        blockName: "ChromaComposite",
        ut: "inst",
      },
      {
        label: "FrameA",
        type: "input",
        valueType: "imagedata",
        blockUuid: "5c21025051e340278d6716d5736c7336",
        blockName: "ChromaComposite",
        ut: "inst",
      },
      {
        label: "FrameB",
        type: "input",
        valueType: "imagedata",
        blockUuid: "5c21025051e340278d6716d5736c7336",
        blockName: "ChromaComposite",
        ut: "inst",
      },
    ],
    outputs: [
      {
        label: "Frame",
        type: "output",
        valueType: "imagedata",
        blockUuid: "5c21025051e340278d6716d5736c7336",
        blockName: "ChromaComposite",
        ut: "inst",
      },
    ],
    code:
      "function ChromaComposite({\n  Mask,\n  FrameA,\n  FrameB,\n}: {\n  Mask: { data: boolean[]; width: number; height: number };\n  FrameA: ImageData;\n  FrameB: ImageData;\n}): { Frame: ImageData } {\n  // Copia i pixel dell'immagine\n  const newData = new ImageData(FrameA.width, FrameA.height);\n\n  // COMPLETA QUI\n\n  return { Frame: newData };\n}\n",
    uuid: "5c21025051e340278d6716d5736c7336",
  },
  {
    type: "FrameInput",
    hardcoded: true,
    customInput: true,
    color: "#423f28",
    inputs: [],
    outputs: [
      {
        label: "Frame",
        type: "output",
        valueType: "imagedata",
        blockUuid: "d2530590e31a4cc1ac613e609eb83fb9",
        blockName: "FrameInput",
        ut: "inst",
      },
    ],
    fn: null,
    uuid: "d2530590e31a4cc1ac613e609eb83fb9",
  },
  {
    type: "DisplayFrame",
    hardcoded: true,
    customInput: false,
    color: "#284042",
    inputs: [
      {
        label: "Frame",
        type: "input",
        valueType: "imagedata",
        blockUuid: "639514e46ba14fd2811ee7e44b28cc6b",
        blockName: "DisplayFrame",
        ut: "inst",
      },
    ],
    outputs: [],
    fn: null,
    uuid: "639514e46ba14fd2811ee7e44b28cc6b",
  },
];

export const initialBlocksPos = [
  {
    uuid: "29f46a6c5736489b944ffbab574dfc9e",
    x: 139.35000610351562,
    y: 66.9000244140625,
  },
  {
    uuid: "a0bc615083f048d3b16f5709c69696c2",
    x: 346.3500061035156,
    y: 59.9000244140625,
  },
  {
    uuid: "6e58a29293d44eaaa49ccc32b14cf302",
    x: 582.3500061035156,
    y: 89.9000244140625,
  },
  {
    uuid: "926160e6a81341f4a88338ad26c1e217",
    x: 342.3500061035156,
    y: 216.9000244140625,
  },
  {
    uuid: "6a2cd6372eda4744af2fa45624881dd2",
    x: 548.3500061035156,
    y: 341.9000244140625,
  },
  {
    uuid: "5c21025051e340278d6716d5736c7336",
    x: 1109.3500061035156,
    y: 66.9000244140625,
  },
  {
    uuid: "d2530590e31a4cc1ac613e609eb83fb9",
    x: 815.3500061035156,
    y: 188.9000244140625,
  },
  {
    uuid: "639514e46ba14fd2811ee7e44b28cc6b",
    x: 1378.3500061035156,
    y: 74.9000244140625,
  },
];

export const initialCustomValues = {
  "6a2cd6372eda4744af2fa45624881dd2": { Number: 70 },
  "926160e6a81341f4a88338ad26c1e217": { U: 108.375, V: 144.64163208007812 },
  d2530590e31a4cc1ac613e609eb83fb9: { selected: 0, Frame: null },
};

export const initialLinks = [
  {
    src: {
      label: "Frame",
      type: "output",
      valueType: "imagedata",
      blockUuid: "5c21025051e340278d6716d5736c7336",
      blockName: "ChromaComposite",
      ut: "inst",
    },
    dst: {
      label: "Frame",
      type: "input",
      valueType: "imagedata",
      blockUuid: "639514e46ba14fd2811ee7e44b28cc6b",
      blockName: "DisplayFrame",
      ut: "inst",
    },
  },
  {
    src: {
      label: "Frame",
      type: "output",
      valueType: "imagedata",
      blockUuid: "d2530590e31a4cc1ac613e609eb83fb9",
      blockName: "FrameInput",
      ut: "inst",
    },
    dst: {
      label: "FrameB",
      type: "input",
      valueType: "imagedata",
      blockUuid: "5c21025051e340278d6716d5736c7336",
      blockName: "ChromaComposite",
      ut: "inst",
    },
  },
  {
    src: {
      label: "Frame",
      type: "output",
      valueType: "imagedata",
      blockUuid: "29f46a6c5736489b944ffbab574dfc9e",
      blockName: "CameraInput",
      ut: "inst",
    },
    dst: {
      label: "FrameA",
      type: "input",
      valueType: "imagedata",
      blockUuid: "5c21025051e340278d6716d5736c7336",
      blockName: "ChromaComposite",
      ut: "inst",
    },
  },
  {
    src: {
      label: "Mask",
      type: "output",
      valueType: "mask",
      blockUuid: "6e58a29293d44eaaa49ccc32b14cf302",
      blockName: "ChromaKeyUV",
      ut: "inst",
    },
    dst: {
      label: "Mask",
      type: "input",
      valueType: "mask",
      blockUuid: "5c21025051e340278d6716d5736c7336",
      blockName: "ChromaComposite",
      ut: "inst",
    },
  },
  {
    src: {
      label: "Number",
      type: "output",
      valueType: "number",
      blockUuid: "6a2cd6372eda4744af2fa45624881dd2",
      blockName: "NumericInput",
      ut: "inst",
    },
    dst: {
      label: "radius",
      type: "input",
      valueType: "number",
      blockUuid: "6e58a29293d44eaaa49ccc32b14cf302",
      blockName: "ChromaKeyUV",
      ut: "inst",
    },
  },
  {
    src: {
      label: "V",
      type: "output",
      valueType: "number",
      blockUuid: "926160e6a81341f4a88338ad26c1e217",
      blockName: "UVInput",
      ut: "inst",
    },
    dst: {
      label: "pV",
      type: "input",
      valueType: "number",
      blockUuid: "6e58a29293d44eaaa49ccc32b14cf302",
      blockName: "ChromaKeyUV",
      ut: "inst",
    },
  },
  {
    src: {
      label: "U",
      type: "output",
      valueType: "number",
      blockUuid: "926160e6a81341f4a88338ad26c1e217",
      blockName: "UVInput",
      ut: "inst",
    },
    dst: {
      label: "pU",
      type: "input",
      valueType: "number",
      blockUuid: "6e58a29293d44eaaa49ccc32b14cf302",
      blockName: "ChromaKeyUV",
      ut: "inst",
    },
  },
  {
    src: {
      label: "Number",
      type: "output",
      valueType: "number",
      blockUuid: "4d29d9f2dfaf4a1c9c0bd534011747a9",
      blockName: "NumericInput",
      ut: "inst",
    },
    dst: {
      label: "pV",
      type: "input",
      valueType: "number",
      blockUuid: "6e58a29293d44eaaa49ccc32b14cf302",
      blockName: "ChromaKeyUV",
      ut: "inst",
    },
  },
  {
    src: {
      label: "Number",
      type: "output",
      valueType: "number",
      blockUuid: "82af33da41e647cc8c97503edb929144",
      blockName: "NumericInput",
      ut: "inst",
    },
    dst: {
      label: "pU",
      type: "input",
      valueType: "number",
      blockUuid: "6e58a29293d44eaaa49ccc32b14cf302",
      blockName: "ChromaKeyUV",
      ut: "inst",
    },
  },
  {
    src: {
      label: "YUVFrame",
      type: "output",
      valueType: "imagedata",
      blockUuid: "a0bc615083f048d3b16f5709c69696c2",
      blockName: "RGBtoYUV",
      ut: "inst",
    },
    dst: {
      label: "YUVFrame",
      type: "input",
      valueType: "imagedata",
      blockUuid: "6e58a29293d44eaaa49ccc32b14cf302",
      blockName: "ChromaKeyUV",
      ut: "inst",
    },
  },
  {
    src: {
      label: "Frame",
      type: "output",
      valueType: "imagedata",
      blockUuid: "29f46a6c5736489b944ffbab574dfc9e",
      blockName: "CameraInput",
      ut: "inst",
    },
    dst: {
      label: "Frame",
      type: "input",
      valueType: "imagedata",
      blockUuid: "a0bc615083f048d3b16f5709c69696c2",
      blockName: "RGBtoYUV",
      ut: "inst",
    },
  },
];
