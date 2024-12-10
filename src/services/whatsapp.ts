import axios from 'axios';

export interface WhatsAppMessageResponse {
  success: boolean;
  error?: any;
  messageId?: string;
}

class WhatsAppService {
  private apiUrl: string;
  private phoneNumberId: string;
  private accessToken: string;
  private version: string;

  constructor() {
    this.version = 'v17.0';
    this.apiUrl = import.meta.env.VITE_WHATSAPP_API_URL || 'https://graph.facebook.com';
    this.phoneNumberId = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID || '';
    this.accessToken = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN || '';
  }

  private formatPhoneNumber(phone: string): string {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Add country code if not present
    return cleaned.startsWith('1') ? cleaned : `1${cleaned}`;
  }

  private async sendRequest(endpoint: string, data: any): Promise<WhatsAppMessageResponse> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.version}/${endpoint}`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          }
        }
      );

      return {
        success: true,
        messageId: response.data.messages?.[0]?.id
      };
    } catch (error: any) {
      console.error('WhatsApp API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  async sendOrderReady(
    phone: string,
    customerName: string,
    orderNumber: string,
    amount: number
  ): Promise<WhatsAppMessageResponse> {
    const data = {
      messaging_product: "whatsapp",
      to: this.formatPhoneNumber(phone),
      type: "template",
      template: {
        name: "order_ready_pickup",
        language: {
          code: "en"
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: customerName
              },
              {
                type: "text",
                text: orderNumber
              },
              {
                type: "currency",
                currency: {
                  fallback_value: `$${amount.toFixed(2)}`,
                  code: "USD",
                  amount_1000: Math.round(amount * 1000)
                }
              }
            ]
          }
        ]
      }
    };

    return this.sendRequest(`${this.phoneNumberId}/messages`, data);
  }

  async sendAppointmentReminder(
    phone: string,
    customerName: string,
    dateTime: string,
    serviceType: string
  ): Promise<WhatsAppMessageResponse> {
    const data = {
      messaging_product: "whatsapp",
      to: this.formatPhoneNumber(phone),
      type: "template",
      template: {
        name: "appointment_reminder",
        language: {
          code: "en"
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: customerName
              },
              {
                type: "text",
                text: dateTime
              },
              {
                type: "text",
                text: serviceType
              }
            ]
          }
        ]
      }
    };

    return this.sendRequest(`${this.phoneNumberId}/messages`, data);
  }

  async sendPromotion(
    phone: string,
    customerName: string,
    discount: string,
    validUntil: string
  ): Promise<WhatsAppMessageResponse> {
    const data = {
      messaging_product: "whatsapp",
      to: this.formatPhoneNumber(phone),
      type: "template",
      template: {
        name: "special_offer",
        language: {
          code: "en"
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: customerName
              },
              {
                type: "text",
                text: discount
              },
              {
                type: "text",
                text: validUntil
              }
            ]
          }
        ]
      }
    };

    return this.sendRequest(`${this.phoneNumberId}/messages`, data);
  }

  // Test the WhatsApp connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/${this.version}/${this.phoneNumberId}?fields=verified_name,quality_rating`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          }
        }
      );
      return response.data.verified_name !== undefined;
    } catch (error) {
      console.error('WhatsApp connection test failed:', error);
      return false;
    }
  }
}

export const whatsappService = new WhatsAppService();
