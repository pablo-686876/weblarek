import { IBuyer, TPayment, TBuyerErrors} from "../../types/index";
import { IEvents } from "../base/Events";

export class Buyer {
  private payment: TPayment;
  private email: string;
  private phone: string;
  private address: string;
  private events: IEvents;
  constructor(events: IEvents) {
    this.payment = "";
    this.email = "";
    this.phone = "";
    this.address = "";
    this.events = events;
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
    this.events.emit("model-buyer:clear-data")
  }

  setBuyerData(buyer: Partial<IBuyer>): void {
    if (buyer.payment !== undefined) {
      this.payment = buyer.payment;
      this.events.emit("model-buyer:order-change")
    }
    if (buyer.email !== undefined) {
      this.email = buyer.email.trim();
      this.events.emit("model-buyer:contacts-change")
    }
    if (buyer.phone !== undefined) {
      this.phone = buyer.phone.trim();
      this.events.emit("model-buyer:contacts-change")
    }
    if (buyer.address !== undefined) {
      this.address = buyer.address.trim();
      this.events.emit("model-buyer:order-change")
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
