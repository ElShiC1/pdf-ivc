import type { Properties, Payment as PaymentIF } from "../model/Properties";

export class Payment {
    height = 83
    padding = 13;
    paddingX: number;
    paddingY: number;


    constructor(private readonly page: Properties, readonly y: number) {
        this.paddingX = this.page.margin + this.padding
        this.paddingY = this.y + this.padding
        this.page.doc.roundedRect(this.page.margin, this.y, this.page.halfWidth, this.height, this.page.cornerRadius).stroke()
    }

    payment(data: PaymentIF) {
        this.renderSubtitle(data)
        this.logo(data.logo)
    }

    private renderSubtitle(data: PaymentIF) {
        const { logo, ...more } = data

        for (let i = 0; i < Object.keys(more).length; i++) {
            const key = Object.entries(more)[i];
            if (key && i <= 1) {
                if (i === 0) {
                    this.Subtitle(key[0], key[1])
                }

                if (i === 1) {
                    this.Subtitle(key[0], key[1], 34.5)
                }
            }
        }
    }

    private logo(value?: string) {
        if (value) {
            this.page.doc.image(value, this.page.halfWidth - this.paddingX * 1.6, this.paddingY - 5, { fit: [this.height - this.padding * 2, 45] });
        }
    }

    private Subtitle(subtitle: string, text: string, y: number = 0) {
        this.page.doc.fillColor('#A3A7AE').font('InterRegular').lineGap(2.5).fontSize(9).text(subtitle, this.paddingX, this.paddingY + y)
        this.page.doc.fillColor('#5E6470').font('InterRegular').fontSize(10).text(text, this.paddingX).fillColor('black')
    }
}