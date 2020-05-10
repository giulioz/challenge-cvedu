function RGBtoYUV({ Frame }: { Frame: ImageData }): { YUVFrame: ImageData } {
  // Copia i pixel dell'immagine
  const newData = new ImageData(Frame.width, Frame.height);

  // Per ogni pixel...
  for (let i = 0; i < Frame.data.length; i += 4) {
    // Estrae i valori di RGB
    const R = Frame.data[i];
    const G = Frame.data[i + 1];
    const B = Frame.data[i + 2];

    // Calcola i valori di YUV applicando una moltiplicazione matriciale
    const Y = 0.257 * R + 0.504 * G + 0.098 * B + 16;
    const U = -0.148 * R - 0.291 * G + 0.439 * B + 128;
    const V = 0.439 * R - 0.368 * G - 0.071 * B + 128;

    // Salva i valori di YUV sulla copia dell'immagine
    newData.data[i] = Y;
    newData.data[i + 1] = U;
    newData.data[i + 2] = V;
    newData.data[i + 3] = 255;
  }

  return { YUVFrame: newData };
}
