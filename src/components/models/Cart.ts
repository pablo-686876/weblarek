import { IProduct } from "../../types/index";

export class Cart {
  private items: IProduct[];

  constructor() {
    this.items = [];
  }
  getCartList(): IProduct[] {
    return this.items;
  }
  addProduct(item: IProduct): void {
    if (!this.items.includes(item)) {
      this.items.push(item);
    }
  }
  deleteProduct(item: IProduct): void {
    const deleteItemIndex = this.items.findIndex((elem) => elem.id === item.id);
    if (deleteItemIndex !== -1) {
      this.items.splice(deleteItemIndex, 1);
    }
  }
  clearCart(): void {
    this.items = [];
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
