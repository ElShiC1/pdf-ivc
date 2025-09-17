import type { Properties } from "../model/Properties";
import type { Table as TableData } from "../model/Properties";

export class Table {
    readonly height: number;
    padding = 14
    paddingY: number
    paddingX: number

    constructor(private page: Properties, readonly y: number) {
        this.paddingX = this.page.margin + this.padding
        this.paddingY = this.y + this.padding
        this.height = this.page.usableHeight / 2.1 + 40
        this.page.doc.roundedRect(this.page.margin, this.y, this.page.usableWidth, this.page.usableHeight / 2.1 + 40, this.page.cornerRadius).stroke();
    }

    Table(data: TableData, current?: number, total?: number, bgResult: string = '#4C63ED', textColor: string = 'white', bgResaltLast: string = '#EFF7FE') {
        const minWidth = 40;
        const fontSize = 10;
        const padding = 10;

        const maxWidth = this.page.usableWidth - this.page.margin - this.padding;

        const { relevant, cols } = data.header.reduce((acc, val) => {

            let col = 1

            if (typeof val === "string") {
                acc = {
                    ...acc,
                    cols: acc.cols === 0 ? col : ++acc.cols
                }
            } else {
                const lengthRelevants = val.relevant.length
                acc = {
                    ...acc,
                    relevant: lengthRelevants
                }
            }
            return acc
        }, { relevant: 0, cols: 0 })

        const baseWidths = Array.from({ length: relevant + cols }).map((_, colIndex) => {
            const maxContentWidth = Math.max(
                ...data.data.map(row => {
                    const cell = row[colIndex];

                    if (typeof cell === "string") {
                        return (this.page.doc.widthOfString as any)(cell, { size: fontSize });
                    }

                    if (Array.isArray(cell?.relevant)) {
                        const text = cell.relevant[colIndex - cols]; // ← ajustamos el índice
                        if (typeof text === "string") {
                            return (this.page.doc.widthOfString as any)(text, { size: fontSize });
                        }
                    }

                    return 0;
                })
            );

            return Math.max(maxContentWidth + padding, minWidth);
        });

        const totalBaseWidth = baseWidths.reduce((a, b) => a + b, 0);
        const scaledWidths = baseWidths.map(w => (w * maxWidth) / totalBaseWidth);

        const headerData = this.Header(data.header, bgResaltLast)

        const tableData = this.Data(data.data, bgResaltLast)

        const resultData = this.Result(data.result, relevant, cols, bgResult, textColor, bgResaltLast)

        this.LayoutTable(headerData, tableData, maxWidth, scaledWidths, resultData);
        this.Pagination(current, total)

    }

    private LayoutTable(header: PDFKit.Mixins.CellOptions[], data: PDFKit.Mixins.CellOptions[][], maxWidth: number, scaledWidths: number[], result?: PDFKit.Mixins.CellOptions[][]) {
        this.page.doc.font('InterRegular')
        this.page.doc.table({
            maxWidth,
            position: {
                x: this.paddingX,
                y: this.paddingY,
            },
            columnStyles: scaledWidths,
            rowStyles: (i) => {
                return i < 1
                    ? { border: [0, 0, 1, 0], borderColor: "#D7DAE0" }
                    : { border: [0, 0, 1, 0], borderColor: "#D7DAE0" };
            },
            data: [
                header,
                ...data,
                ...(result || [])
            ],
        })
    }

    private Header(data: TableData['header'], bgResaltLast: string = '#EFF7FE') {
        const headerData = data.map((value) => {
            const baseCells: PDFKit.Mixins.CellOptions[] = [];
            const relevantCells: PDFKit.Mixins.CellOptions[] = [];

            if (typeof value === "string") {
                baseCells.push({
                    text: value,
                    padding: "0.65em",
                    align: { x: "left", y: "center" },
                    border: { bottom: 0.1 }
                })
            } else {
                const relevantMap = value.relevant.map((text, j) => ({
                    text,
                    padding: "0.65em",
                    align: { x: (j === 0 ? "left" : "right"), y: "center" } as { x: "left" | "center" | "right" | "justify"; y: "top" | "center" | "bottom" },
                    backgroundColor: bgResaltLast,
                    border: { bottom: 0.1 }
                }));


                if (relevantMap.length > 1) {
                    relevantCells.push(...relevantMap);
                }
            }

            return [...baseCells, ...relevantCells]; // relevant siempre al final
        }).flat().sort((a, b) => {
            const aHasBg = !!a.backgroundColor;
            const bHasBg = !!b.backgroundColor;

            if (aHasBg === bHasBg) return 0;
            return aHasBg ? 1 : -1; // los que tienen backgroundColor van al final
        });
        return headerData
    }

    private Data(data: TableData['data'], bgResaltLast: string = '#EFF7FE') {
        const tableData = data.map((fila) => {
            const baseCells: PDFKit.Mixins.CellOptions[] = [];
            const relevantCells: PDFKit.Mixins.CellOptions[] = [];

            fila.forEach((value, i) => {
                if (typeof value === "string") {
                    baseCells.push({
                        text: value,
                        padding: "0.65em",
                        align: { x: "left", y: "center" },
                        border: { bottom: 0.1 }
                    });
                } else {
                    const relevantMap = value.relevant.map((text, j) => ({
                        text,
                        padding: "0.65em",
                        align: { x: j === 0 ? "left" : "right", y: "center" },
                        backgroundColor: bgResaltLast,
                        border: { bottom: 0.1 }
                    }));

                    if (relevantMap.length > 1) {
                        relevantCells.push(...(relevantMap as PDFKit.Mixins.CellOptions[]));
                    }
                }
            });

            const allCells = [...baseCells, ...relevantCells];

            // Ordena: primero sin backgroundColor, luego con backgroundColor
            return allCells.sort((a, b) => {
                const aHasBg = !!a.backgroundColor;
                const bHasBg = !!b.backgroundColor;

                if (aHasBg === bHasBg) return 0;
                return aHasBg ? 1 : -1;
            });
        });

        return tableData
    }

    private Result(data: TableData['result'], relevant: number, cols: number, bgResult: string = '#4C63ED', textColor: string = 'white', bgResaltLast: string = '#EFF7FE') {
        const resultData = data.map((value, i, array) => {
            if (i === array.length - 1) {
                return [
                    {
                        colSpan: cols,
                        border: false,
                    },
                    {
                        text: value.key,
                        colSpan: Math.max(relevant - 1, 1),
                        font: 'InterBold',
                        backgroundColor: bgResult,
                        border: false,
                        textStrokeColor: textColor,
                        textStroke: 0.5,
                        textColor: textColor,
                        padding: "0.65em", align: {
                            x: 'left',
                            y: 'center'
                        },
                    },
                    {
                        text: value.value,
                        colSpan: 1,
                        backgroundColor: bgResult,
                        textStrokeColor: textColor,
                        textStroke: 0.5,
                        textColor:textColor,
                        border: false,
                        textOptions: {
                            align: 'center'
                        },
                        padding: "0.65em", align: {
                            x: 'right',
                            y: 'center'
                        },
                    }
                ]
            }
            return [
                {
                    colSpan: cols,
                    border: false,
                },
                {
                    text: value.key,
                    colSpan: Math.max(relevant - 1, 1),
                    font: 'InterBold',
                    backgroundColor: bgResaltLast,
                    border: false,
                    textStrokeColor: 'black',
                    textStroke: 0.5,
                    textColor: 'black',
                    padding: "0.65em", align: {
                        x: 'left',
                        y: 'center'
                    },
                },
                {
                    text: value.value,
                    colSpan: 1,
                    backgroundColor: bgResaltLast,
                    textStrokeColor: 'black',
                    textStroke: 0.5,
                    textColor: 'black',
                    border: false,
                    textOptions: {
                        align: 'center'
                    },
                    padding: "0.65em", align: {
                        x: 'right',
                        y: 'center'
                    },
                }
            ]
        })
        return resultData as PDFKit.Mixins.CellOptions[][]
    }

    private Pagination(current?: number, total?: number) {
        if (!current || !total) return
        this.page.doc.fontSize(10).text(`${current} - ${total}`, this.page.doc.x + 5, this.paddingY + this.height - 35) 
    }
}