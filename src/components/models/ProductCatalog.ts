import { IProduct } from "../../types/index";

export class ProductCatalog {
  private items: IProduct[];
  private current_item: IProduct | null;

  constructor() {
    this.items = [];
    this.current_item = null;
  }
  setProducts(items: IProduct[]): void {
    this.items = items;
  }
  getProducts(): IProduct[] {
    return this.items;
  }
  getProductbyId(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }
  setCurrentProduct(item: IProduct): void {
    this.current_item = item;
  }
  getCurrentProduct(): IProduct | null {
    return this.current_item;
  }
}
