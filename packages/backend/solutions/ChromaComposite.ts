function ChromaComposite({
  Mask,
  FrameA,
  FrameB,
}: {
  Mask: { data: boolean[]; width: number; height: number };
  FrameA: ImageData;
  FrameB: ImageData;
}): { Frame: ImageData } {
  // Copia i pixel dell'immagine
  const newData = new ImageData(FrameA.width, FrameA.height);

  for (let i = 0; i < FrameA.data.length; i += 4) {
    if (Mask.data[i / 4]) {
      newData.data[i] = FrameA.data[i];
      newData.data[i + 1] = FrameA.data[i + 1];
      newData.data[i + 2] = FrameA.data[i + 2];
    } else {
      newData.data[i] = FrameB.data[i];
      newData.data[i + 1] = FrameB.data[i + 1];
      newData.data[i + 2] = FrameB.data[i + 2];
    }

    newData.data[i + 3] = 255;
  }

  return { Frame: newData };
}
