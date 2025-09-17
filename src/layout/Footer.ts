import type { Properties, Footer as FooterIF } from "../model/Properties";

export class Footer {
    padding = 15;
    height = 65;
    paddingY: number;
    paddingX: number;


    constructor(private readonly page: Properties, readonly y: number, borderColor: string = '#CFCFCF') {
        this.paddingX = this.page.margin + this.padding
        this.paddingY = this.y + this.padding
        this.page.doc.save()
            .roundedRect(this.page.margin, this.y, this.page.halfWidth, this.height, this.page.cornerRadius)
            .fillAndStroke('#F3F3F3', borderColor)
            .restore();
    }

    footer(data: FooterIF = { logo: 'img/img-3.png', text: 'Gracias por la compra', contact: 'www.example.com' }) {
        this.Logo(data.logo)
        this.Message(data.text)
        this.Contact(data.contact)
    }

    private Logo(value: string) {
        this.page.doc.image(value, this.paddingX, this.paddingY, { fit: [this.height - this.padding * 2, 100] });
    }

    private Contact(text: string) {
        this.page.doc
            .font('InterRegular') // fuente en negrita
            .fillColor('#5E6470')
            .fontSize(10.5)
            .lineGap(0.5)
            .text(text);
    }

    private Message(text: string) {
        this.page.doc
            .font('InterSemiBold') // fuente en negrita
            .fillColor('#5E6470')     // texto verde
            .fontSize(10.5)
            .text(text, this.paddingX * 2.6, this.paddingY + 3.2)
    }

} 