import { IProduct } from "../../types/index";

export class ProductCatalog {
  private items: IProduct[];
  private current_item: IProduct | null;

  constructor(items: IProduct[] = [], current_item: IProduct | null = null) {
    this.items = items;
    this.current_item = current_item;
  }
  setProducts(items: IProduct[]): void {
    this.items = items;
  }
  getProducts(): IProduct[] {
    return this.items;
  }
  getProductbyId(id: string): IProduct | null {
    // если item - undefined, значит вернет null, т.к. undefined проверяется первым
    return this.items.find((item) => item.id === id) || null;
  }
  setCurrentProduct(item: IProduct): void {
    this.current_item = item;
  }
  getCurrentProduct(): IProduct | null {
    return this.current_item;
  }
}
