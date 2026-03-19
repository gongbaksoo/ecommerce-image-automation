import html2canvas from 'html2canvas';

export async function captureElement(
  element: HTMLElement,
  options?: { width?: number; height?: number; format?: 'png' | 'jpg' }
): Promise<Blob> {
  const canvas = await html2canvas(element, {
    useCORS: true,
    allowTaint: true,
    scale: 2,
    width: options?.width,
    height: options?.height,
    backgroundColor: options?.format === 'jpg' ? '#ffffff' : null,
  });

  const mimeType = options?.format === 'jpg' ? 'image/jpeg' : 'image/png';
  const quality = options?.format === 'jpg' ? 0.92 : 1.0;

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('이미지 변환에 실패했습니다'));
      },
      mimeType,
      quality
    );
  });
}
