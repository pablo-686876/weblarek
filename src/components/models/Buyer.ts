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

  validatePayment(payment: TPayment): boolean {
    if (payment !== "") {
      return true;
    }
    return false;
  }

  validateEmail(email: string): boolean {
    if (email.length > 0) {
      return true;
    }
    return false;
  }

  validatePhone(phone: string): boolean {
    if (phone.length > 0) {
      return true;
    }
    return false;
  }

  validateAddress(address: string): boolean {
    if (address.length > 0) {
      return true;
    }
    return false;
  }

  validateBuyerData(): TBuyerErrors {
    const errors: TBuyerErrors = {};
    if (!this.validatePayment(this.payment)) {
      errors.payment = "Не выбран тип оплаты";
    }
    if (!this.validateEmail(this.email)) {
      errors.email = "Некорректный email";
    }
    if (!this.validatePhone(this.phone)) {
      errors.phone = "Некорректный номер телефона";
    }
    if (!this.validateAddress(this.address)) {
      errors.address = "Некорректный адрес";
    }
    return errors;
  }
}
