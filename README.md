# pdf-ivc  
Generates customizable A4 PDF templates ans QR code generation.  
Returns both image and PDF as buffers.  
<img src="https://raw.githubusercontent.com/ElShiC1/pdf-ivc/refs/heads/main/asset/upload/img/qr/0.png" width="500" alt="pdf-ivc" />
## Install
```sh
npm install pdf-ivc -E
```
## Example

```js
import PDFInvoice from "pdf-ivc";
import fs from "node:fs"

const images = await PDFInvoice(data).image(3)
//image(scale: number);
images.forEach((image, index) => {
  fs.writeFileSync(`upload/img/qr/${index}.png`, image);
});
```

