import type { Enterprise, Order, Properties } from "../model/Properties";

export class Header {
    headerHeight = 73.5;
    padding = 15;
    x: number
    y: number


    constructor(private readonly page: Properties) {
        this.x = this.page.margin + this.padding;
        this.y = this.page.margin + this.padding;
        const availableWidth = this.page.usableWidth - this.padding * 2;
    }

    Enterprise(data: Enterprise, color = '#4C63ED', borderColor = '#E8E8E8') {
        const availableHeight = this.headerHeight - this.padding * 2;
        this.page.doc.roundedRect(this.page.margin, this.page.margin, this.page.usableWidth, this.headerHeight, this.page.cornerRadius).fillAndStroke('white', borderColor)
            .restore();
        this.page.doc.image(data.logo, this.x, this.y, { fit: [availableHeight, 100] });

        this.page.doc
            .font('InterBold') // fuente en negrita
            .fillColor(color)     // texto verde
            .fontSize(12)
            .text(data.name, this.y + 55, this.x);

        this.page.doc
            .font('InterRegular') // fuente en negrita
            .fillColor('#5E6470')
            .fontSize(10)
            .moveDown(0.4)
            .lineGap(0.8)
            .text(data.indificatorTribute);

        this.page.doc
            .font('InterRegular') // fuente en negrita
            .fontSize(10)
            .text(data.aditional);

    }

    Order(data: Order & { color: string }) {

        const availableHeight = this.headerHeight - this.padding * 2;

        this.page.doc
            .font('InterBold') // fuente en negrita
            .fillColor(data.color)
            .fontSize(10)
            .text(data.id, !data.qr ? this.y + 60 : this.y + 6, this.x, {
                width: 475,
                align: 'right'
            });

        this.page.doc
            .font('InterRegular') // fuente en negrita
            .fillColor(data.payment.color)
            .fontSize(8)
            .lineGap(1.8)
            .text(data.payment.text, {
                width: 475,
                align: 'right'
            });

        this.page.doc
            .font('InterRegular') // fuente en negrita
            .fillColor('#5E6470')
            .fontSize(8)
            .text(data.aditional, {
                width: 475,
                align: 'right'
            });


        this.page.doc
            .font('InterRegular') // fuente en negrita
            .fillColor('#5E6470')
            .fontSize(8)
            .text(data.createAt, {
                width: 475,
                align: 'right'
            });


        if (data.qr) {
            this.page.doc.image(data.qr, this.page.usableWidth - 50, this.page.margin + this.headerHeight - 62.7, { fit: [55, 100] });
        }


    }


}