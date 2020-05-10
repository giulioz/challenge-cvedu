function ChromaKeyUV({
  YUVFrame,
  pU,
  pV,
  radius,
}: {
  YUVFrame: ImageData;
  pU: number;
  pV: number;
  radius: number;
}): { Mask: { data: boolean[]; width: number; height: number } } {
  // Crea una maschera vuota
  const data = new Array<boolean>(YUVFrame.width * YUVFrame.height).fill(false);

  for (let i = 0; i < YUVFrame.data.length; i += 4) {
    // Estraggo i valori di U e V per quel pixel
    const U = YUVFrame.data[i + 1];
    const V = YUVFrame.data[i + 2];

    // Calcolo la distanza fra il pixel e i valori di u e v desiderati
    const du = U - pU;
    const dv = V - pV;

    // Ne faccio la somma dei quadrati
    const d2 = du * du + dv * dv;

    // E calcolo il quadrato del raggio
    const r2 = radius * radius;

    // Se la somma dei quadrati è inferiore al quadrato del raggio il pixel è valido
    data[i / 4] = d2 < r2;
  }

  return { Mask: { data, width: YUVFrame.width, height: YUVFrame.height } };
}
