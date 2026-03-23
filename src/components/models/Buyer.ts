import { IBuyer, TPayment, IBuyerErrors} from "../../types/index";

export class Buyer {
  private payment: TPayment;
  private email: string;
  private phone: string;
  private address: string;
  constructor(
    payment: TPayment = "",
    email: string = "",
    phone: string = "",
    address: string = "",
  ) {
    this.payment = payment;
    this.email = email;
    this.phone = phone;
    this.address = address;
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
    ((this.payment = ""),
      (this.email = ""),
      (this.phone = ""),
      (this.address = ""));
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

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  validatePhone(phone: string): boolean {
    const phoneRegex = /^\+7\d{10}$/;
    return phoneRegex.test(phone);
  }
  validateAddress(address: string): boolean {
    if (address.length > 0) {
        return true
    }
    return false
  }
  validateBuyerData(): {isValid: boolean, errors: IBuyerErrors} {
    const errors: IBuyerErrors = {};
    if (!this.validateEmail(this.email)) {
        errors.email = "Некорректный email"
    }
    if (!this.validatePhone(this.phone)) {
        errors.phone = "Некорректный номер телефона"
    }
    if (!this.validateAddress(this.address)) {
        errors.address = "Некорректный адрес"
    }
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
  }
}
