const a_step = 0.1;
const r_step = 4.0;
const max_r = 400.0;

function Hough({
  YUVFrame,
  Mask,
}: {
  YUVFrame: ImageData;
  Mask: { data: boolean[]; width: number; height: number };
}): {
  Accumulator: {
    data: number[];
    width: number;
    height: number;
    alpha_steps: number;
    r_steps: number;
  };
} {
  // Accumulatore
  const alpha_steps = Math.round(Math.PI / a_step) + 1;
  const r_steps = Math.round((max_r * 2.0) / r_step) + 1;
  const accData = new Array(alpha_steps * r_steps).fill(0);

  for (let i = 0; i < YUVFrame.data.length; i += 4) {
    const maskValue = Mask.data[i / 4];
    const imgY = YUVFrame.data[i + 0];

    const x = (i / 4) % YUVFrame.width;
    const y = Math.floor(i / 4 / YUVFrame.width);

    // COMPLETA QUI
  }

  return {
    Accumulator: {
      data: accData,
      width: Mask.width,
      height: Mask.height,
      alpha_steps,
      r_steps,
    },
  };
}
