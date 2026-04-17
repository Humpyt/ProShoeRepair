import axios from 'axios';

interface PrinterConfig {
  type?: string;
  interface?: string;
  characterSet?: string;
  width?: number;
  options?: {
    timeout?: number;
  };
}

interface PrintJob {
  type: 'text' | 'qr' | 'barcode' | 'image' | 'cut' | 'feed';
  content?: string;
  align?: 'left' | 'center' | 'right';
  style?: {
    bold?: boolean;
    underline?: boolean;
    size?: 'normal' | 'wide' | 'tall' | 'big';
  };
}

export interface ReceiptData {
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  items: Array<{
    description: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax?: number;
  total: number;
  date: Date;
  promisedDate?: Date;
  notes?: string;
}

export interface PolicyPrintData {
  ticketNumber: string;
  date: string;
  customerNumber: string;
  customerName: string;
}

class PrinterService {
  private config: PrinterConfig;
  private baseUrl = '/api/printer';

  constructor(config: PrinterConfig = {}) {
    this.config = {
      width: 42,
      ...config
    };
  }

  async getConfig(): Promise<PrinterConfig> {
    try {
      const response = await axios.get(`${this.baseUrl}/config`);
      this.config = response.data;
      return this.config;
    } catch (error) {
      console.error('Failed to get printer config:', error);
      throw error;
    }
  }

  async updateConfig(config: Partial<PrinterConfig>): Promise<PrinterConfig> {
    try {
      const response = await axios.put(`${this.baseUrl}/config`, config);
      this.config = response.data;
      return this.config;
    } catch (error) {
      console.error('Failed to update printer config:', error);
      throw error;
    }
  }

  async printOrder(orderId: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/print/order/${orderId}`);
    } catch (error) {
      console.error('Failed to print order:', error);
      throw error;
    }
  }

  async printQuotation(quotationId: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/print/quotation/${quotationId}`);
    } catch (error) {
      console.error('Failed to print quotation:', error);
      throw error;
    }
  }

  async printReceipt(data: ReceiptData): Promise<void> {
    try {
      // For now, we'll just print the order if it exists
      if (data.orderNumber) {
        await this.printOrder(data.orderNumber);
      } else {
        throw new Error('No order number provided');
      }
    } catch (error) {
      console.error('Failed to print receipt:', error);
      throw error;
    }
  }

  async printPolicy(data: PolicyPrintData): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/print/policy`, data);
    } catch (error) {
      console.error('Failed to print policy:', error);
      throw error;
    }
  }
}

export const printerService = new PrinterService();
