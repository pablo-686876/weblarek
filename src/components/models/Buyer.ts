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

  setBuyerData(buyer: IBuyer): void {
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

  validateBuyerData(): TBuyerErrors {
    const errors: TBuyerErrors = {};
    if (!this.payment) {
      errors.payment = "Не выбран тип оплаты";
    }
    if (!this.email) {
      errors.email = "Некорректный email";
    }
    if (!this.phone) {
      errors.phone = "Некорректный номер телефона";
    }
    if (!this.address) {
      errors.address = "Некорректный адрес";
    }
    return errors;
  }
}
