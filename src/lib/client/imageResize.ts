/*
 * 업로드 전에 브라우저 캔버스로 이미지를 다듬는다.
 * GIF는 캔버스가 첫 프레임만 그려 애니메이션이 깨지므로 건드리지 않는다.
 */

const TRIM_ALPHA_THRESHOLD = 10;

async function loadBitmap(file: File): Promise<ImageBitmap | null> {
  if (typeof createImageBitmap === "undefined") return null;
  try {
    return await createImageBitmap(file);
  } catch {
    return null;
  }
}

function canvasToFile(canvas: HTMLCanvasElement, source: File, quality: number): Promise<File> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob ? new File([blob], source.name, { type: source.type }) : source),
      source.type,
      quality,
    );
  });
}

/** 긴 변이 maxDimension을 넘으면 비율을 유지해 축소한다. */
export async function resizeImageIfNeeded(file: File, maxDimension: number): Promise<File> {
  if (file.type === "image/gif") return file;
  const bitmap = await loadBitmap(file);
  if (!bitmap) return file;

  if (bitmap.width <= maxDimension && bitmap.height <= maxDimension) {
    bitmap.close();
    return file;
  }

  const scale = maxDimension / Math.max(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    return file;
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvasToFile(canvas, file, 0.9);
}

/**
 * 가장자리의 투명 여백을 실제 내용 경계까지 잘라낸다.
 * 디자인 툴에서 그림자/여백을 남기고 내보낸 PNG를 올리면 팝업에 원치 않는 여백이 생기는 문제를 막는다.
 */
export async function trimTransparentPadding(file: File): Promise<File> {
  if (file.type === "image/gif" || file.type === "image/jpeg") return file;
  const bitmap = await loadBitmap(file);
  if (!bitmap) return file;

  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    return file;
  }
  context.drawImage(bitmap, 0, 0);
  bitmap.close();

  let imageData: ImageData;
  try {
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  } catch {
    return file;
  }

  const { data, width, height } = imageData;
  const alphaAt = (x: number, y: number) => data[(y * width + x) * 4 + 3];
  const rowHasContent = (y: number) => {
    for (let x = 0; x < width; x++) if (alphaAt(x, y) > TRIM_ALPHA_THRESHOLD) return true;
    return false;
  };
  const columnHasContent = (x: number, top: number, bottom: number) => {
    for (let y = top; y <= bottom; y++) if (alphaAt(x, y) > TRIM_ALPHA_THRESHOLD) return true;
    return false;
  };

  let top = 0;
  let bottom = height - 1;
  let left = 0;
  let right = width - 1;
  while (top < bottom && !rowHasContent(top)) top++;
  while (bottom > top && !rowHasContent(bottom)) bottom--;
  while (left < right && !columnHasContent(left, top, bottom)) left++;
  while (right > left && !columnHasContent(right, top, bottom)) right--;

  const trimmedWidth = right - left + 1;
  const trimmedHeight = bottom - top + 1;
  // 잘라낼 여백이 거의 없으면(1% 미만) 원본을 그대로 쓴다.
  if (trimmedWidth >= width * 0.99 && trimmedHeight >= height * 0.99) return file;
  if (trimmedWidth <= 0 || trimmedHeight <= 0) return file;

  const output = document.createElement("canvas");
  output.width = trimmedWidth;
  output.height = trimmedHeight;
  const outputContext = output.getContext("2d");
  if (!outputContext) return file;
  outputContext.putImageData(imageData, -left, -top);
  return canvasToFile(output, file, 0.92);
}

export async function readImageSize(file: File): Promise<{ width: number; height: number } | null> {
  const bitmap = await loadBitmap(file);
  if (!bitmap) return null;
  const size = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return size;
}
