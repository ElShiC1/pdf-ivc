import { Page } from "../../src/layout/Page";



const Header = {
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
}

const ColsOne = {
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
}

const Table = {
    header: [
        "ID",
        "Edad",
        "Email",
        { relevant: ["Nombre", "Alias", "Wow"] },
        "Estado",
    ],
    data: Array.from({ length: 18 }, (_, i) => [
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
}

const Payment = {
    "Nr° Cuenta": "191-23456789-0-12",
    "Empresa": "Enpvase S.A.C",
    logo: 'img/img-3.png'
}

const PaymentDetails = {
    "Nr° Operación": "123456",
    "Banco": "Banco de Crédito",
    "Método de pago": "Efectivo",
    "Operacion": "24 de Enero del 2025 - 08:07 PM",
    logo: 'img/img-3.png'
}

const Footer = {
    logo: 'img/img-3.png',
    text: 'Gracias por la compra',
    contact: 'www.example.com'
}


describe("Page Class", () => {
    const page = new Page();
    describe('Header Method', () => {
        test('Header correct data', () => {
            expect(() => page['Header'](Header.enterprise, Header.order, '#4C63ED')).not.toThrow();
        })

        test('Header incorrect data', () => {
            expect(() => (page['Header'] as any)(null, null, 313)).toThrow("Error in Header");
        })
    })

    describe('ColsOne Method (Details)', () => {

        const header = page['Header'](Header.enterprise, Header.order, '#4C63ED');

        test('ColsOne correct data', () => {
            expect(() => page['ColsOne'](ColsOne, header)).not.toThrow();
        })

        test('ColsOne incorrect data', () => {
            expect(() => (page['ColsOne'] as any)(null, null)).toThrow("Error in ColsOne");
        })

    })

    describe('ColsTwo Method (Details)', () => {

        const header = page['Header'](Header.enterprise, Header.order, '#4C63ED');

        test('ColsTwo correct data', () => {
            expect(() => page['ColsTwo'](ColsOne, header)).not.toThrow();
        })

        test('ColsTwo incorrect data', () => {
            expect(() => (page['ColsTwo'] as any)(null, null)).toThrow("Error in ColsTwo");
        })

    })

    describe('Table Method', () => {
        const header = page['Header'](Header.enterprise, Header.order, '#4C63ED');
        const colsOne = page['ColsOne'](ColsOne, header);

        test('Table correct data', () => {
            expect(() => page['Table'](Table, colsOne)).not.toThrow();
        })

        test('Table incorrect data', () => {
            expect(() => (page['Table'] as any)(null, null)).toThrow("Error in Table");
        })
    })

    describe('Payment Method', () => {
        const header = page['Header'](Header.enterprise, Header.order, '#4C63ED');
        const colsOne = page['ColsOne'](ColsOne, header);
        const table = page['Table'](Table, colsOne);

        test('Payment correct data', () => {
            expect(() => page['Payment'](Payment, table)).not.toThrow();
        })

        test('Payment incorrect data', () => {
            expect(() => (page['Payment'] as any)(null, null)).toThrow("Error in Payment");
        })
    })

    describe('PaymentDetails Method', () => {
        const header = page['Header'](Header.enterprise, Header.order, '#4C63ED');
        const colsOne = page['ColsOne'](ColsOne, header);
        const table = page['Table'](Table, colsOne);

        test('PaymentDetails correct data', () => {
            expect(() => page['PaymentDetails'](PaymentDetails, table)).not.toThrow();
        })

        test('PaymentDetails incorrect data', () => {
            expect(() => (page['PaymentDetails'] as any)(null, null)).toThrow("Error in PaymentDetails");
        })

    })

    describe('Footer Method', () => {
        const header = page['Header'](Header.enterprise, Header.order, '#4C63ED');
        const colsOne = page['ColsOne'](ColsOne, header);
        const table = page['Table'](Table, colsOne);
        const payment = page['Payment'](Payment, table);

        test('Footer correct data', () => {
            expect(() => page['Footer'](Footer, payment)).not.toThrow();
        })

        test('Footer incorrect data', () => {
            expect(() => (page['Footer'] as any)(null, null)).toThrow("Error in Footer");
        })
    })

    describe('Layout Method', () => {

        test('LayoutRender correct data', () => {
            expect(() => page['Layout']({ header: Header, details: { colsOne: ColsOne, colsTwo: ColsOne }, table: Table, payment: Payment, paymentDetails: PaymentDetails, footer: Footer })).not.toThrow();
        })

        test('LayoutRender incorrect data', () => {
            expect(() => (page['Layout'] as any)(null)).toThrow("Error in Layout")
        })
    })

    describe('LayoutRender Method', () => {
        test('LayoutRender correct data - Lenght 12', () => {
            expect(() => page.LayoutRender({ header: Header, details: { colsOne: ColsOne, colsTwo: ColsOne }, table: { ...Table, data: Table.data.slice(0, 12) }, payment: Payment, paymentDetails: PaymentDetails, footer: Footer })).not.toThrow();
        })

        test('LayoutRender correct data - Lenght 18', () => {
            expect(() => page.LayoutRender({ header: Header, details: { colsOne: ColsOne, colsTwo: ColsOne }, table: Table, payment: Payment, paymentDetails: PaymentDetails, footer: Footer })).not.toThrow();
        })
    })
})