import { pdf } from 'pdf-to-img';

export async function ImagePDF(buffer: Buffer, scale = 1): Promise<Buffer[]> {
  const document = await pdf(buffer, { scale });
  const images: Buffer[] = [];
  for await (const image of document) {
    images.push(image);
  }
  return images;
}