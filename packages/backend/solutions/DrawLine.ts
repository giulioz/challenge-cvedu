function DrawLine({
  Frame,
  A,
  R,
}: {
  Frame: ImageData;
  A: number;
  R: number;
}): { Frame: ImageData } {
  const newData = new ImageData(Frame.width, Frame.height);

  for (let i = 0; i < Frame.data.length; i += 4) {
    const R = Frame.data[i];
    const G = Frame.data[i + 1];
    const B = Frame.data[i + 2];

    newData.data[i] = R;
    newData.data[i + 1] = G;
    newData.data[i + 2] = B;
    newData.data[i + 3] = 255;
  }

  A = -A - (90 * Math.PI) / 180;

  for (let x = 0; x < Frame.width; x++) {
    const px = (x * 2) / Frame.width - 1;
    const s = Frame.width / Math.cos(A);
    const py = px * Math.sin(A) * s;

    const y = Math.round(Frame.height / 2 - py / 2);
    const i = (x + y * Frame.width) * 4;
    newData.data[i] = 255;
    newData.data[i + 1] = 255;
    newData.data[i + 2] = 255;
  }

  return { Frame: newData };
}
