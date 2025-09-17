import type { Properties, PaymentDetails as PaymentDetailsIF } from "../model/Properties";

export class PaymentDetails {
    padding = 13;
    paddingX: number;
    paddingY: number;


    constructor(private readonly page: Properties, readonly y: number) {
        this.paddingX = this.page.margin + this.page.halfWidth + this.page.sectionSpacing + this.padding
        this.paddingY = this.y + this.padding
        this.page.doc.roundedRect(this.page.margin + this.page.halfWidth + this.page.sectionSpacing, this.y, this.page.halfWidth, 157, this.page.cornerRadius).stroke(); // Confirmación de pago
    }

    paymentDetails(data: PaymentDetailsIF) {
        if (!data.message) {
            if (typeof data.logo === "string") {
                this.logo(data.logo);
            }
            this.renderSubtitle(data)
            return;
        }
        this.Subtitle(data.message.key, data.message.value, 0, this.page.halfWidth - this.padding)
    }

    private logo(value?: string) {
        if (value) {
            this.page.doc.image(value, this.page.usableWidth - this.padding * 2 - this.page.margin - this.page.sectionSpacing, this.paddingY - 5, { fit: [50, 50] });
        }
    }

    private renderSubtitle(data: PaymentDetailsIF) {

        const { logo, message, ...more } = data

        for (let i = {
            index: 0,
            increment: 0
        }; i.index <= Object.keys(more).length; i.index++, i.increment += 35) {
            const key = Object.entries(more)[i.index];
            if (Array.isArray(key) && key.length === 2 && i.index <= 4) {
                if (i.index === 0) {
                    this.Subtitle(String(key[0]), String(key[1]))
                } else {
                    this.Subtitle(String(key[0]), String(key[1]), i.increment)
                }
            }
        }
    }


    private Subtitle(subtitle: string = "Undefined", text: string = "Undefined", y: number = 0, widthText?: number | undefined) {
        this.page.doc.fillColor('#A3A7AE').font('InterRegular').lineGap(2.5).fontSize(9).text(subtitle, this.paddingX, this.paddingY + y)
        this.page.doc.fillColor('#5E6470').font('InterRegular').fontSize(10).text(text, this.paddingX, undefined, { width: widthText }).fillColor('black')
    }
}