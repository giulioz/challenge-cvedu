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

  // COMPLETA QUI

  return { Frame: newData };
}
