import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class ProductCatalog {
  private items: IProduct[];
  private current_item: IProduct | null;
  private events: IEvents;

  constructor(events: IEvents) {
    this.items = [];
    this.current_item = null;
    this.events = events;
  }
  setProducts(items: IProduct[]): void {
    this.items = items;
    this.events.emit("model-catalog:set-products")
  }
  getProducts(): IProduct[] {
    return this.items;
  }
  getProductbyId(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }
  setCurrentProduct(item: IProduct): void {
    this.current_item = item;
    this.events.emit("model-catalog:set-current-product")
  }
  getCurrentProduct(): IProduct | null {
    return this.current_item;
  }
}
