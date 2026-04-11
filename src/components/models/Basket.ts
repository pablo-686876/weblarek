import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class Basket {
  private items: IProduct[];
  private events: IEvents;

  constructor(events: IEvents) {
    this.items = [];
    this.events = events;
  }
  getCartList(): IProduct[] {
    return this.items;
  }
  addProduct(item: IProduct): void {
    if (!this.items.includes(item)) {
      this.items.push(item);
      this.events.emit("model-basket:change-cart")
    }
  }
  deleteProduct(item: IProduct): void {
    const deleteItemIndex = this.items.findIndex((elem) => elem.id === item.id);
    if (deleteItemIndex !== -1) {
      this.items.splice(deleteItemIndex, 1);
      this.events.emit("model-basket:change-cart")
    }
  }
  clearCart(): void {
    this.items = [];
    this.events.emit("model-basket:clear-cart")
  }
  getCartSum(): number {
    return this.items.reduce((sum, item) => (sum += item.price || 0), 0);
  }
  getCartProductCount(): number {
    return this.items.length;
  }
  isCartProductById(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
