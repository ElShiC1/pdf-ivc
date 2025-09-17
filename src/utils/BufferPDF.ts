import { Page } from "../layout/Page";
import type { Data } from "../model/Properties";
import QRCode from 'qrcode';


/**
 * Generates a PDF document from structured data and returns it as a Buffer.
 *
 * If a QR code string is provided in `data.header.order.qr`, it will be rendered into the PDF
 * using the specified color from `data.config.color` or defaulting to black.
 *
 * @param data - The structured data used to render the PDF layout, including header, table, and config.
 * @returns A Promise that resolves to a Buffer containing the final PDF document.
 */
export const BufferPDF = async (data: Data): Promise<Buffer> => {
    return new Promise<Buffer>(async (resolve, reject) => {
        try {
            const QrCode = typeof data.header.order.qr === 'string'
                ? await QRCode.toBuffer(data.header.order.qr, {
                    color: { dark: data.config?.color || '#000000' }
                })
                : undefined;

            const page = new Page();
            page.LayoutRender({
                ...data,
                header: {
                    ...data.header,
                    order: {
                        ...data.header.order,
                        qr: QrCode
                    }
                }
            });

            const buffers: Buffer[] = [];

            page.doc.on('data', (chunk) => buffers.push(chunk));
            page.doc.on('end', () => resolve(Buffer.concat(buffers)));
            page.doc.on('error', reject);

            page.doc.end();
        } catch (err) {
            reject(err);
        }
    });
};