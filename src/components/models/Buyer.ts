import { IBuyer, TPayment, TBuyerErrors} from "../../types/index";

export class Buyer {
  private payment: TPayment;
  private email: string;
  private phone: string;
  private address: string;
  constructor() {
    this.payment = "";
    this.email = "";
    this.phone = "";
    this.address = "";
  }
  getBuyerData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }
  clearBuyerData(): void {
    this.payment = "",
    this.email = "",
    this.phone = "",
    this.address = "";
  }

  setBuyerData(buyer: Partial<IBuyer>): void {
    if (buyer.payment !== undefined) {
      this.payment = buyer.payment;
    }
    if (buyer.email !== undefined) {
      this.email = buyer.email.trim();
    }
    if (buyer.phone !== undefined) {
      this.phone = buyer.phone.trim();
    }
    if (buyer.address !== undefined) {
      this.address = buyer.address.trim();
    }
  }

  validateBuyerData(fields?: (keyof TBuyerErrors)[]): TBuyerErrors {
    const errors: TBuyerErrors = {};
    const validateFields = fields || ['payment', 'address', 'email', 'phone'];

    if (validateFields.includes('payment') && !this.payment) {
      errors.payment = "Не выбран тип оплаты";
    }
    if (validateFields.includes('email') && !this.email) {
      errors.email = "Некорректный email";
    }
    if (validateFields.includes('phone') && !this.phone) {
      errors.phone = "Некорректный номер телефона";
    }
    if (validateFields.includes('address') && !this.address) {
      errors.address = "Некорректный адрес";
    }
    return errors;
  }
}
