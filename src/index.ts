import type { Data } from './model/Properties'
import { BufferPDF } from './utils/BufferPDF';
import { ImagePDF } from './utils/ImagePDF';

/**
 * Creates a PDF invoice interface with two methods:
 * - `pdf`: Generates a PDF document from the provided data.
 * - `image`: Converts the generated PDF into one or more PNG images.
 *
 * @param data - The structured invoice data including header, table, and configuration.
 * @returns An object with `pdf()` and `image(scale)` methods.
 */
const PDFInvoice = (data: Data) => ({
  /**
   * Generates a PDF document from the provided data.
   *
   * @returns A Promise that resolves to a Buffer containing the PDF file.
   */
  pdf: async (): Promise<Buffer> => {
    return await BufferPDF(data);
  },

  /**
   * Converts the generated PDF into PNG images.
   * Only works with PNG format. The `scale` parameter adjusts image resolution.
   *
   * @param scale - A numeric factor to control image resolution (default is 1).
   * @returns A Promise that resolves to an array of Buffers, each representing a PNG image.
   */
  image: async (scale = 1): Promise<Buffer[]> => {
    const bufferPdf = await BufferPDF(data);
    return await ImagePDF(bufferPdf, scale);
  }
});

export default PDFInvoice