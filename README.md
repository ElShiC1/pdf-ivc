# pdf-ivc  
Generates customizable A4 PDF templates ans QR code generation.  
Returns both image and PDF as buffers.  
<img src="https://raw.githubusercontent.com/ElShiC1/pdf-ivc/refs/heads/main/asset/upload/img/qr/0.png" width="500" alt="pdf-ivc" />
## Install
```sh
npm install pdf-ivc -E
```
## Example
**Function image()**
```js
import PDFInvoice from "pdf-ivc";
import fs from "node:fs"

//image(scale: number) - return Promise<Buffer[]>;
const images = await PDFInvoice(data).image(3)

images.forEach((image, index) => {
  fs.writeFileSync(`upload/img/qr/${index}.png`, image);
});
```

**Function pdf()**
```js
import PDFInvoice from "pdf-ivc";
import fs from "node:fs"

//pdf() - return Promise<Buffer>;
const pdf = await PDFInvoice(data).pdf()

fs.writeFileSync('upload/pdf/qr/pdf.pdf', pdf)
```

## Structure

#### Header

`Enterprise` Este objeto contiene los datos corporativos utilizados para personalizar encabezados en documentos PDF generados por la plataforma. Logotipo, nombre comercial, un identificador tributario y un campo `aditional` para contacto.

```js
const enterprise = {
            logo: 'img/logo.png',
            name: "PDF-IVC, Corp",
            aditional: 'www.pdf-ivc.com',
            indificatorTribute: 'RUC 0222351515',
        }
```
`Type: Enterprise`
```ts
interface Enterprise {
    logo: PDFKit.Mixins.ImageSrc,
    name: string,
    indificatorTribute: string,
    aditional: string,
}
```
`Type: PDFKit.Mixins.ImageSrc`
```ts
type ImageSrc = Buffer | ArrayBuffer | string;
```

`Order`
Este objeto representa los datos asociados a una orden de compra o solicitud de servicio. Se utiliza para generar documentos PDF personalizados con información relevante del pedido.
```js
const order = {
     id: 'N° 0001-2025',
     aditional: 'Av. Angamos Nro. 1805 - 01234567',
     createAt: '01 Enero 2025 - 08:07 PM',
     payment: { text: 'Pendiente - Efectivo', color: 'green' },
      //Optional qr
     qr: 'www.pdf-ivc.com'
}
```
`Type: Order`
```ts
interface Order {
    id: string,
    payment: {
        color: string,
        text: string
    },
    aditional: string,
    createAt: string,
    qr?: PDFKit.Mixins.ImageSrc
}
```
#### Details

`ColsOne` Este objeto contiene información organizada en bloques numerados, pensados para ser presentados como columnas o secciones visuales dentro de documentos PDF.
```ts
const colsOne = {
            title: "Cliente", "1": {
                Nombre: "Emilio Sánchez Pérez Mamani",
                DNI: "DNI 12345678"
            }, "2": {
                Telefono: "+51 912345789",
                "Codigo Postal": "2",
            }, "3": {
                "Email": "emilio@pdf_ivc.com",
                "Nr°": "123"
            }
        }
```
`ColsTwo` Este objeto contiene información organizada en bloques numerados, pensados para ser presentados como columnas o secciones visuales dentro de documentos PDF.
```js
const colsTwo = {
            title: "Envio",
            "1": {
                Empresa: "Shalom",
                Clave: "12345"
            },
            "2": {
                Ubicacion: "Peru, Lima, Chorrillos",
                "Codigo Postal": "140105",
            },
            "3": {
                "Dirección de Domicilio": "Jr. Peru 1234",
                "Nr°": "123"
            }
        },
```

`Type: Cols`
```ts
interface Cols {
    title: string,
    "1": {
        [x: string]: string
    }
    "2"?: {
        [x: string]: string
    }
    "3"?: {
        [x: string]: string
    }
}
```
#### Table

`Header` Este arreglo define los encabezados que se utilizarán en la tabla principal del documento PDF.  
```js
const header = [
            "ID",
            "Nombre",
            "Descripcion",
            { relevant: ["Quantity", "Price U.", "Total Price"] },
        ]
```
`Data` El sistema de generación de documentos PDF incluye una lógica de paginación integrada. Por cada **12 ítems** registrados en el arreglo `data`, se crea automáticamente una nueva página en el documento.
```js
const data = data: Array.from({ length: 48 }, (_, i) => [
            `U${1000 + i}`,
            `Manzana`,
            `Manzana roja`, 
            { relevant: [`${i + 1}`, `S/${i + 1}.00`, `S/${i + 100}.00`] },
        ]),
```

`Result`
El último objeto del arreglo `Total Importe` representa el resultado más importante o relevante, y suele destacarse visualmente como cierre.
```js
const result = [
            { key: "OP. GRAVADA", value: "S/39.33" },
            { key: "IGV -18%", value: "S/7.07" },
            { key: "Total Importe", value: S/"46.40" }
        ]
```

`Type: Table`
```ts
interface Table {
    header: ({ relevant: string[] } | string)[],
    data: ({ relevant: string[] } | string)[][],
    result: {
        key: string,
        value: string
    }[],
}
```
#### Payment
Este objeto contiene información relacionada con los datos de pago que se mostrarán.
```js
const payment = {
        "Nr° Cuenta": "191-23456789-0-12",
        "Empresa": "Enpvase S.A.C",
        logo: 'img/img-3.png'
    }
```
`Type: Payment`
```ts
export Payment {
    [x: string]: string
}
```
#### PaymentDetails
Este objeto contiene los detalles específicos de una operación de pago que serán mostrados.
```js
const paymentDetails = {
        "Nr° Operación": "123456",
        "Banco": "Banco de Crédito",
        "Método de pago": "Efectivo",
        "Operacion": "24 de Enero del 2025 - 08:07 PM",
        logo: 'img/img-3.png'
    }
```
`Message` Este campo opcional dentro del objeto `paymentDetails` permite mostrar un mensaje personalizado en el documento PDF, generalmente utilizado para advertencias, condiciones o notas importantes relacionadas con el pago.
```js
const paymentDetails = {
        message: {
          key: 'Mensaje',
          value: "⚠️Importante antes de realizar el pago: Por favor, asegúrese de revisar su pedido cuidadosamente. No se aceptan devoluciones. Una vez confirmado el pago, su pedido llegará en un plazo de 15 días."
        },
    }
```
`Type: PaymentDetails`
```ts
export interface PaymentDetails {
    logo?: PDFKit.Mixins.ImageSrc,
    message?: {
        key: string, value: string
    },
    [x: string]: string | { key: string, value: string } | PDFKit.Mixins.ImageSrc
}
```
#### Footer
Incluye elementos visuales y de contacto que refuerzan el cierre del documento.
```js
const footer = {
        logo: 'img/logo.png',
        text: 'Gracias por la compra',
        contact: 'www.pdf-ivc.com'
    }
```
`Type: Footer`
```ts
interface Footer {
    logo: string
    text: string,
    contact: string
}
```
#### Config
Permite personalizar colores generales, bordes, códigos QR y estilos específicos de la tabla
```js
const config = {
        color: '#4C63ED',
        borderColor: '#E8E8E8',
        qrColor: 'blue',
        table: {
            bgResaltLast: 'white',
            textColor: 'black',
            bgResult: 'blue'
        }
    }
```
`Type: Config`
```ts
interface Config {
    color?: string;
    borderColor?: string;
    qrColor?: string;
    table?: {
      bgResult?: string;
      textColor?: string;
      bgResaltLast?: string;
    };
```
