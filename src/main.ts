import "./scss/styles.scss";
import { WebApi } from "./components/models/WebApi";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { ProductCatalog } from "./components/models/ProductCatalog";

const api = new Api(API_URL);
const web = new WebApi(api);

const testCatalog = await web.getProductList();
const productsModel = new ProductCatalog();
productsModel.setProducts(testCatalog);
console.log("Массив товаров из каталога:", productsModel.getProducts());
