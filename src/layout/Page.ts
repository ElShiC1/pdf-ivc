import PDFDocument from 'pdfkit';
import type { Data, Details, Enterprise, Order, Table as TableData, Payment as PaymentData, PaymentDetails as PaymentDetailsData, Footer as FooterData } from '../model/Properties';
import { Header } from './Header';
import { ColsOne } from './ColsOne';
import { ColsTwo } from './ColsTwo';
import { Table } from './Table';
import { Payment } from './Payment';
import { PaymentDetails } from './PaymentDetails';
import { Footer } from './Footer';

export class Page {
  margin = 15;
  doc: PDFKit.PDFDocument;
  pageWidth: number;
  pageHeight: number;
  usableWidth: number;
  usableHeight: number;
  cornerRadius = 20;
  halfWidth: number;
  sectionSpacing = 10;
  static header = Header
  static colsOne = ColsOne
  static colsTwo = ColsTwo
  static table = Table
  static payment = Payment
  static paymentDetails = PaymentDetails
  static footer = Footer


  constructor() {
    this.doc = new PDFDocument({ margin: this.margin, size: 'A4' });
    this.pageWidth = this.doc.page.width;
    this.pageHeight = this.doc.page.height;
    this.usableWidth = this.pageWidth - this.margin * 2;
    this.usableHeight = this.pageHeight - this.margin * 2;
    this.halfWidth = this.usableWidth / 2.05;
    this.config()
  }

  private config() {
    this.doc.registerFont('InterRegular', 'font/Inter_18pt-Regular.ttf');
    this.doc.registerFont('InterSemiBold', 'font/Inter_18pt-SemiBold.ttf');
    this.doc.registerFont('InterBold', 'font/Inter_18pt-Bold.ttf');
    this.doc.strokeColor('#CCCCCC')
  }

  LayoutRender(data: Data) {
    const blockSize = 12;
    const dataTable = data.table.data;

    // Si no hay más de 12 elementos, renderiza directamente sin paginar
    if (dataTable.length <= blockSize) {
      this.Layout(data);
      return;
    }

    // Si hay más de 12, paginamos en bloques
    for (let i = 0; i < dataTable.length; i += blockSize) {
      const currentPage = Math.floor(i / blockSize) + 1;

      // Calcula el slice de datos para esta página
      const dataSlice = dataTable.slice(i, i + blockSize);

      // Calcula el total de páginas para pasarlo como límite visual
      const totalPages = Math.ceil(dataTable.length / blockSize);

      // Clona los datos y reemplaza solo el bloque actual
      const dataCloned: Data = {
        ...data,
        table: {
          ...data.table,
          data: dataSlice,
          result: currentPage === totalPages ? data.table.result : [] // Solo muestra resultados en la última página
        }
      };

      // Agrega una nueva página si no es la primera
      if (i > 0) {
        this.AddPage();
      }



      // Renderiza el layout con la página actual y el total de páginas
      this.Layout(dataCloned, currentPage, totalPages);
    }

  }

  private Layout(data: Data, current?: number, limit?: number) {
    try {
      const header = this.Header(
        data.header.enterprise,
        data.header.order,
        data.config?.color ?? '#4C63ED',
        data.config?.borderColor ?? '#CFCFCF'
      )
      const colsOne = this.ColsOne(
        data.details.colsOne,
        header,
        data.config?.color ?? '#4C63ED'
      )
      const colsTwo = this.ColsTwo(
        data.details.colsTwo,
        header,
        data.config?.color ?? '#4C63ED'
      )
      const table = this.Table(data.table, colsOne, current, limit, data.config?.table?.bgResaltLast ?? '#EFF7FE', data.config?.table?.bgResult ?? '#4C63ED', data.config?.table?.textColor ?? 'white')
      const payment = this.Payment(data.payment, table)
      const paymentDetails = this.PaymentDetails(data.paymentDetails, table)
      const footer = this.Footer(data.footer, payment, data.config?.borderColor ?? '#CFCFCF')
    } catch (error) {
      throw new Error(`Error in Layout: ${error}`);
    }

  }

  private Header(enterprise: Enterprise, order: Order, color: string, borderColor: string = '#E8E8E8') {
    try {
      const header = new Page.header(this);
      header.Enterprise({ ...enterprise }, color, borderColor)
      header.Order({ ...order, color })
      return header
    } catch (error) {
      throw new Error(`Error in Header: ${error}`);
    }

  }

  private ColsOne(data: Details["colsOne"], header: Header, color: string = '#4C63ED') {
    try {
      const colsOne = new Page.colsOne(this, this.margin + header.headerHeight + this.sectionSpacing)
      colsOne.ColsOne(data, color)
      return colsOne
    } catch (error) {
      throw new Error(`Error in ColsOne: ${error}`);
    }
  }

  private ColsTwo(data: Details["colsTwo"], header: Header, color: string = '#4C63ED') {
    try {
      const colsTwo = new Page.colsTwo(this, this.margin + header.headerHeight + this.sectionSpacing)
      colsTwo.ColsTwo(data, color)
      return colsTwo
    } catch (error) {
      throw new Error(`Error in ColsTwo: ${error}`);
    }

  }

  private Table(data: TableData, colsOne: ColsOne, current?: number, limit?: number, bgResaltLast: string = '#EFF7FE', bgResult: string = '#4C63ED', textColor: string = 'white') {
    try {
      const table = new Page.table(this, colsOne.y + this.sectionSpacing + 123)
      table.Table(data, current, limit, bgResult, textColor, bgResaltLast)
      return table
    } catch (error) {
      throw new Error(`Error in Table: ${error}`);
    }

  }

  private Payment(data: PaymentData, table: Table) {
    try {
      const payment = new Page.payment(this, table.y + table.height + this.sectionSpacing)
      payment.payment(data)
      return payment
    } catch (error) {
      throw new Error(`Error in Payment: ${error}`);
    }

  }

  private PaymentDetails(data: PaymentDetailsData, table: Table) {
    try {
      const paymentDetails = new Page.paymentDetails(this, table.y + table.height + this.sectionSpacing)
      paymentDetails.paymentDetails(data)
      return paymentDetails
    } catch (error) {
      throw new Error(`Error in PaymentDetails: ${error}`);
    }

  }

  private Footer(data: FooterData, payment: Payment, borderColor: string = '#CFCFCF') {
    try {
      const footer = new Page.footer(this, payment.y + payment.height + this.sectionSpacing, borderColor)
      footer.footer(data)
      return footer
    } catch (error) {
      throw new Error(`Error in Footer: ${error}`);
    }

  }

  private AddPage() {
    this.doc.addPage();
  }

}