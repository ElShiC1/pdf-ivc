export interface Properties {
    doc: PDFKit.PDFDocument
    pageWidth: number
    pageHeight: number
    usableWidth: number
    usableHeight: number
    cornerRadius: number;
    halfWidth: number;
    sectionSpacing: number;
    margin: number
}

interface Header {
    enterprise: Enterprise,
    order: Order
}

export interface Enterprise {
    logo: PDFKit.Mixins.ImageSrc,
    name: string,
    indificatorTribute: string,
    aditional: string,
}

export interface Order {
    id: string,
    payment: {
        color: string,
        text: string
    },
    aditional: string,
    createAt: string,
    qr?: PDFKit.Mixins.ImageSrc | undefined
}

export interface Details {
    colsOne: Cols
    colsTwo: Cols
}

export interface Payment {
    [x: string]: string
}

export interface PaymentDetails {
    logo?: PDFKit.Mixins.ImageSrc,
    message?: {
        key: string, value: string
    },
    [x: string]: string | { key: string, value: string } | PDFKit.Mixins.ImageSrc
}

export interface Footer {
    logo: string
    text: string,
    contact: string
}


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


export interface Table {
    header: ({ relevant: string[] } | string)[],
    data: ({ relevant: string[] } | string)[][],
    result: {
        key: string,
        value: string
    }[],
}

/**
 * Represents the full structure of data used to generate a PDF invoice.
 */
export interface Data {
  /**
   * Header information including enterprise and order details.
   */
  header: {
    enterprise: Enterprise;
    order: Order;
  };

  /**
   * Additional details split into two column groups.
   */
  details: {
    colsOne: Cols;
    colsTwo: Cols;
  };

  /**
   * Table data containing rows and layout configuration.
   */
  table: Table;

  /**
   * Payment summary information.
   */
  payment: Payment;

  /**
   * Detailed breakdown of the payment.
   */
  paymentDetails: PaymentDetails;

  /**
   * Footer content for the invoice.
   */
  footer: Footer;

  /**
   * Optional configuration for visual styling and QR rendering.
   */
  config?: {
    /**
     * Primary color used in the document.
     */
    color?: string;

    /**
     * Border color for table and layout elements.
     */
    borderColor?: string;

    /**
     * Color used for QR code rendering.
     */
    qrColor?: string;

    /**
     * Table-specific visual configuration.
     */
    table?: {
      /**
       * Background color for result rows.
       */
      bgResult?: string;

      /**
       * Text color for table content.
       */
      textColor?: string;

      /**
       * Background color for the last highlighted row.
       */
      bgResaltLast?: string;
    };
  };
}

