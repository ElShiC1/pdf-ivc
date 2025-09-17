import pdfInvoice from "../src/index";
import { Data } from "../src/model/Properties";
import fs from 'node:fs'

const data: Data = {
    header: {
        enterprise: {
            logo: 'img/img.png',
            name: "Panda, Inc",
            aditional: 'www.panda.com',
            indificatorTribute: 'RUC 072865788',
        },
        order: {
            id: 'N° 0001-2025',
            aditional: 'Av. Angamos Nro. 1805 - 01234567',
            createAt: '01 Enero 2025 - 08:07 PM',
            payment: { text: 'Pendiente - Efectivo', color: 'green' },
        }
    },
    details: {
        colsOne: {
            title: "Cliente", "1": {
                Nombre: "Emilio Sánchez Pérez Mamani",
                DNI: "DNI 72865788"
            }, "2": {
                Telefono: "+51 910907242",
                "Codigo Postal": "2",
            }, "3": {
                "Email": "eros.mio2004@gmail.com",
                "Nr°": "123"
            }
        },
        colsTwo: {
            title: "Envio",
            "1": {
                Empresa: "Shalom",
                Clave: "12345"
            },
            "2": {
                Ubicacion: "Peru, Lima, Chorrillos",
                "Codigo Postal": "2",
            },
            "3": {
                "Dirección de Domicilio": "Jr. Pedro Garezon Mz J3 Lt3",
                "Nr°": "123"
            }
        },
    },
    table: {
        header: [
            "ID",
            "Edad",
            "Email",
            { relevant: ["Nombre", "Alias", "Wow"] },
            "Estado",
        ],
        data: Array.from({ length: 12 }, (_, i) => [
            `U${1000 + i}`, // ID
            `${20 + i}`,
            `${20 + i}`, // Edad
            `user${i}@ex.com`,
            { relevant: ["Pepito", "Juanio", "Wow"] },
        ]),
        result: [
            { key: "Total activos", value: "7" },
            { key: "Promedio edad", value: "26.5" },
            { key: "Usuarios por región", value: "Zona 0" }
        ]
    },
    payment: {
        "Nr° Cuenta": "191-23456789-0-12",
        "Empresa": "Enpvase S.A.C",
        logo: 'img/img-3.png'
    },
    paymentDetails: {
        "Nr° Operación": "123456",
        "Banco": "Banco de Crédito",
        "Método de pago": "Efectivo",
        "Operacion": "24 de Enero del 2025 - 08:07 PM",
        logo: 'img/img-3.png'
    },
    footer: {
        logo: 'img/img-3.png',
        text: 'Gracias por la compra',
        contact: 'www.example.com'
    },
}


describe('PDFInvoice', () => {
    describe('With QR', () => {
        test('should generate a PDF buffer - with QR', async () => {
            const pdfBuffer = await pdfInvoice({
                ...data,
                header: {
                    ...data.header,
                    order: {
                        ...data.header.order,
                        qr: 'https://medium.com/geekculture/a-beginners-guide-to-unit-testing-with-jest-549a47edd3ea'
                    }
                }
            }).pdf()
            expect(pdfBuffer).toBeInstanceOf(Buffer);
        })
    })

    describe('Without QR', () => {
        test('should generate a PDF buffer - without QR', async () => {
            const pdfBuffer = await pdfInvoice(data).pdf();
            expect(pdfBuffer).toBeInstanceOf(Buffer);
        })
    });

    describe('Generate PDF Without QR - BufferPDF', () => {
        const items = [12, 24, 60, 120]
        test.each(items)('%i items should generate a valid PDF - Buffer', async (count) => {
            const testdata = await pdfInvoice({
                ...data, table: {
                    ...data.table,
                    data: Array.from({ length: count }, (_, i) => [
                        `U${1000 + i}`, // ID
                        `${20 + i}`,
                        `${20 + i}`, // Edad
                        `user${i}@ex.com`,
                        { relevant: ["Pepito", "Juanio", "Wow"] },
                    ]),
                }
            }).pdf()
            expect(testdata).toBeInstanceOf(Buffer);
        }, 20000)

        test.each(items)('%i items should generate a valid PDF - WriteFile PDF', async (count) => {
            const testdata = await pdfInvoice({
                ...data, table: {
                    ...data.table,
                    data: Array.from({ length: count }, (_, i) => [
                        `U${1000 + i}`, // ID
                        `${20 + i}`,
                        `${20 + i}`, // Edad
                        `user${i}@ex.com`,
                        { relevant: ["Pepito", "Juanio", "Wow"] },
                    ]),
                }
            }).pdf()
            fs.writeFileSync(`uploads/${count}-item.pdf`, testdata)
            expect(fs.existsSync(`uploads/${count}-item.pdf`)).toBe(true);
        }, 20000)

    },)

});
