const a_step = 0.01;
const r_step = 4.0;
const max_r = 400.0;

function HoughMax({
  Accumulator,
}: {
  Accumulator: {
    data: number[];
    width: number;
    height: number;
    alpha_steps: number;
    r_steps: number;
  };
}): { A: number; R: number; A_Deg: number } {
  // Variabili per immagazzinare i massimi trovati
  let current_a = 0;
  let current_r = 0;
  let current_max = 0;

  for (let r = 0; r < Accumulator.r_steps; r++) {
    for (let a = 0; a < Accumulator.alpha_steps; a++) {
      const value = Accumulator.data[a + r * Accumulator.alpha_steps];

      if (value > current_max) {
        current_max = value;
        current_a = a * a_step;
        current_r = r * r_step - max_r;
      }
    }
  }

  return { A: current_a, R: current_r, A_Deg: current_a * (180.0 / Math.PI) };
}
