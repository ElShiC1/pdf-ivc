import type { Details, Properties } from "../model/Properties";

export class ColsTwo {
    padding = 14
    paddingY: number
    paddingX: number


    constructor(private readonly page: Properties, private readonly y: number) {
        this.paddingX = this.page.margin + this.page.halfWidth + this.page.sectionSpacing + this.padding
        this.paddingY = this.y + this.padding
        this.page.doc.roundedRect(this.page.margin + this.page.halfWidth + this.page.sectionSpacing, this.y, this.page.halfWidth + 4, 123, this.page.cornerRadius).stroke(); // Empresa
    }

    ColsTwo(data: Details['colsTwo'], color: string = '#4C63ED') {
        this.Title(data.title, color)
        for (const [key, value] of Object.entries(data)) {
            if (key === "1") {
                this.renderBlock(value, 'main', 0.45)
            }
            if (["2", "3"].includes(key)) {
                this.renderBlock(value, 'subtitle', 0.4)
            }
        }
    }

    private Title(value: string, color: string = '#4C63ED') {
        this.page.doc.fillColor(color).font('InterSemiBold').fontSize(10).text(value, this.paddingX, this.paddingY)
        this.page.doc.moveDown(0.1)
    }

    private MainData(text: string, y?: number, x?: number) {
        const doc = this.page.doc;
        const xStart = this.paddingX; // posición horizontal inicial
        const yStart = doc.y;         // posición vertical actual

        doc.font('InterSemiBold').fillColor('#5E6470').fontSize(9);

        // Primer texto
        const widthTextFirst = doc.widthOfString(text)
        doc.text(text, x ?? xStart, y ?? yStart);


        return [yStart, xStart + widthTextFirst + 15]
    }

    private Subtitle(subtitle: string, text: string, y?: number, x = 0) {
        const numberY = this.page.doc.y
        const Subtitle = this.page.doc.widthOfString(subtitle)
        const Text = this.page.doc.widthOfString(text)
        this.page.doc.fillColor("#969AA2").font('InterRegular').lineGap(2.5).fontSize(8).text(subtitle, this.paddingX + x, y)
        this.page.doc.fillColor("#5E6470").font('InterRegular').fontSize(9).text(text, this.paddingX + x)
        return [numberY, (Subtitle > Text ? Subtitle + 15 : Text + 15)]
    }

    private renderBlock(
        entries: Record<string, string>,
        type: 'subtitle' | 'main',
        moveDown: number
    ) {
        let number = 1;
        let numberone = 0
        let widthone = 0
        for (const [k, val] of Object.entries(entries)) {
            if (number === 1) {
                const [numberOne, widthOne] = type === 'subtitle' ? this.Subtitle(k, val) : this.MainData(val)
                numberone = numberOne!
                widthone = widthOne!
            }
            if (number === 2) {
                 type === 'subtitle' ? this.Subtitle(k, val, numberone, widthone) : this.MainData(val, numberone, widthone)
                this.page.doc.moveDown(moveDown);
            }
            number++;
        }
    }
}
