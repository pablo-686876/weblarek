import "./scss/styles.scss";
import { WebApi } from "./components/models/WebApi";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { ProductCatalog } from "./components/models/ProductCatalog";
import { Cart } from "./components/models/Cart";
import { Buyer } from "./components/models/Buyer";
import { apiProducts } from "./utils/data";
import { IOrderRequest } from "./types";

// тестирование на моковых данных
const testCatalog = new ProductCatalog();
const testCart = new Cart();
const testBuyer = new Buyer();

// тестирование класса ProductCatalog
testCatalog.setProducts(apiProducts.items);
console.log("Получение массива товаров:", testCatalog.getProducts());
console.log("Получение товара по id:", testCatalog.getProductbyId("854cef69-976d-4c2a-a18c-2aa45046c390"));
console.log("Получение товара по id - undefined:", testCatalog.getProductbyId("test"));
testCatalog.setCurrentProduct(apiProducts.items[0]);
console.log("Получение товара для подробного отображения:", testCatalog.getCurrentProduct());

// тестирование класса Cart
testCart.addProduct(apiProducts.items[0]);
testCart.addProduct(apiProducts.items[1]);
console.log("Получение массива товаров из корзины:", testCart.getCartList());
console.log("Получение суммы стоимости товаров из корзины:", testCart.getCartSum(),);
console.log("Получение количества товаров из корзины:", testCart.getCartProductCount());
console.log("Получение товара по id - true:", testCart.isCartProductById("854cef69-976d-4c2a-a18c-2aa45046c390"));
console.log("Получение товара по id - false:", testCart.isCartProductById("test"));
testCart.deleteProduct(apiProducts.items[0]);
console.log("Получение массива товаров из корзины после удаления:", testCart.getCartList());
testCart.clearCart();
console.log("Получение массива товаров из корзины после очистки корзины:", testCart.getCartList());

// тестирование класса Buyer
testBuyer.setBuyerData({
  payment: "card",
  email: "test@example.com",
  phone: "+79998881123",
  address: "test adddress",
});
console.log("Получение данных покупателя:", testBuyer.getBuyerData());
console.log("Валидация данных покупателя - true:", testBuyer.validateBuyerData());
testBuyer.clearBuyerData();
console.log("Получение данных покупателя после их удаления:", testBuyer.getBuyerData());
testBuyer.setBuyerData({
  payment: "",
  email: "",
  phone: "",
  address: "",
});
console.log("Валидация данных покупателя - false:", testBuyer.validateBuyerData());

// тестирование через сервер
const api = new Api(API_URL);
const web = new WebApi(api);

const order: IOrderRequest = {
  payment: "card",
  email: "test@example.com",
  phone: "+71234567890",
  address: "test address",
  total: 2200,
  items: [
    "854cef69-976d-4c2a-a18c-2aa45046c390",
    "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
  ],
};

async function init() {
  try {
    const testapiCatalog = await web.getProductList();
    const productsModel = new ProductCatalog();
    productsModel.setProducts(testapiCatalog);
    console.log(
      "Массив товаров из каталога (через сервер):",
      productsModel.getProducts(),
    );
  } catch (error) {
    console.error("Ошибка инициализации", error);
  }
}

async function post(data: IOrderRequest = order) {
  try {
    const testapiOrder = await web.postOrder(data);
    console.log("Заказ оформлен (через сервер):", testapiOrder);
    console.log("ID заказа:", testapiOrder.id);
    console.log("Сумма:", testapiOrder.total);
  } catch (error) {
    console.error("Ошибка сервера", error);
  }
}

init();
post();
