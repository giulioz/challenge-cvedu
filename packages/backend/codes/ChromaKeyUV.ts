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

  // COMPLETA QUI

  return { Mask: { data, width: YUVFrame.width, height: YUVFrame.height } };
}
