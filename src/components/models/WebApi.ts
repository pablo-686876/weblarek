import {
  IApi,
  IOrderRequest,
  IOrderResponse,
  IProductsResponse,
} from "../../types";
import { IProduct } from "../../types";

export class WebApi {
  private api: IApi;
  constructor(api: IApi) {
    this.api = api;
  }

  async getProductList(): Promise<IProduct[]> {
    const response = await this.api.get<IProductsResponse>("/product/");
    return response.items;
  }

  async postOrder(data: IOrderRequest): Promise<IOrderResponse> {
    return await this.api.post<IOrderResponse>("/order/", data);
  }
}
