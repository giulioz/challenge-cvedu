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

    // Se un pixel è stato selezionato dalla maschera può far parte della barra
    if (maskValue) {
      // Creo la sua curva trasformata iterando per ogni angolo
      for (let a = 0.0; a < Math.PI; a += a_step) {
        // Calcolo il parametro r per tale angolo
        const r = x * Math.cos(a) + y * Math.sin(a);

        // Se tale parametro è compreso nei bound attesi...
        if (r > -max_r && r < max_r) {
          // Calcolo la cella nell'accumulatore
          const r_pos = Math.floor((r + max_r) / r_step);
          const a_pos = Math.floor(a / a_step);

          // E vi aggiungo il valore della luminanza
          accData[a_pos + r_pos * alpha_steps] += imgY;
        }
      }
    }
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
