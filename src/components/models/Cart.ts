import { IProduct } from "../../types/index";

export class Cart {
  private items: IProduct[];

  constructor(items: IProduct[] = []) {
    this.items = items;
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
    const deleteItem = this.items.find((elem) => elem.id === item.id) || null;
    if (deleteItem) {
      const index = this.items.indexOf(deleteItem);
      this.items.splice(index, 1);
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
    const item = this.items.find((elem) => elem.id === id) || null;
    if (item) {
      return this.items.includes(item);
    }
    return false;
  }
}
