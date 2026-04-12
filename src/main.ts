import "./scss/styles.scss";
import { WebApi } from "./components/models/WebApi";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { ProductCatalog } from "./components/models/ProductCatalog";
import { Basket } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";
import { IProduct, IBuyer } from "./types";
import { EventEmitter } from "./components/base/Events";
import { Header } from "./components/view/Header";
import { Gallery } from "./components/view/Gallery";
import { ensureElement, cloneTemplate } from "./utils/utils";
import { CardBasket } from "./components/view/card/CardBasket";
import { CardCatalog } from "./components/view/card/CardCatalog";
import { CardPreview } from "./components/view/card/CardPreview";
import { Modal } from "./components/view/Modal";
import { BasketView } from "./components/view/BasketView";
import { SuccessOrder } from "./components/view/SuccessOrder";
import { OrderForm } from "./components/view/form/OrderForm";
import { ContactsForm } from "./components/view/form/ContactsForm";

// создание брокера событий
const events = new EventEmitter();

// создание экземпляра api
const api = new Api(API_URL);
const web = new WebApi(api);

// создание экземпляров моделей
const catalog = new ProductCatalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);

// создание шаблонов
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketViewTemplate = ensureElement<HTMLTemplateElement>("#basket");
const successOrderTemplate = ensureElement<HTMLTemplateElement>("#success");
const orderFormTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsFormTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const cardPreviewTemplate = cloneTemplate<HTMLTemplateElement>("#card-preview");

// создание экземпляров представлений
const header = new Header(ensureElement<HTMLElement>(".header"), events);
const modal = new Modal(ensureElement<HTMLElement>(".modal"));
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));
const orderForm = new OrderForm(cloneTemplate<HTMLFormElement>(orderFormTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>(contactsFormTemplate), events);
const successOrder = new SuccessOrder(cloneTemplate<HTMLElement>(successOrderTemplate), events);
const basketView = new BasketView(cloneTemplate<HTMLElement>(basketViewTemplate), events);

const cardPreview = new CardPreview(cardPreviewTemplate, {
  onClick: () => {
    events.emit("render:card-preview-purchase");
  }
})

async function init() {
  try {
    const apiCatalog = await web.getProductList();
    catalog.setProducts(apiCatalog);
  } catch (error) {
    console.error("Ошибка инициализации", error);
  }
}

init();

// вспомогательные функции
function cardPreviewText(item: IProduct): string {
  if (!catalog.getProductbyId(item.id)?.price) {
    return "Недоступно";
  }
  if (!basket.isCartProductById(item.id)) {
    return "В корзину";
  }
  return "Удалить из корзины";
}

// вспомогательные функции рендера
function renderCardCatalog(item: IProduct): HTMLElement {
  const card = new CardCatalog(cloneTemplate<HTMLElement>(cardCatalogTemplate), {
    onClick: () => {
      events.emit("render:card-catalog-select", item)
    }
  });
  return card.render(item);
}

function renderCardPreview(item: IProduct): HTMLElement {
  return cardPreview.render({ ...item, buttonText: cardPreviewText(item), isActive: !!(item.price) });
}

function renderCardBasket(item: IProduct, index: number): HTMLElement {
  const card = new CardBasket(cloneTemplate<HTMLElement>(cardBasketTemplate), {
    onClick: () => {
      events.emit("render:card-basket-delete", item)
    }
  });
  return card.render({ ...item, index: index + 1 });
}

function renderBasketView(): HTMLElement {
  const cards = basket.getCartList().map(renderCardBasket);
  return basketView.render({ price: basket.getCartSum(), items: cards, canOrder: cards });
}

function renderHeader(): HTMLElement {
  return header.render({ counter: basket.getCartProductCount() });
}

function renderOrderForm(showErrors: boolean): HTMLElement {
  const { payment, address } = buyer.getBuyerData();
  const errors = buyer.validateBuyerData(['payment', 'address']);
  const errorsToShow = showErrors ? errors : {};
  return orderForm.render({ payment, address, errors: errorsToShow, valid: Object.keys(errors).length === 0 })
}

function renderContactsForm(showErrors: boolean): HTMLElement {
  const { phone, email } = buyer.getBuyerData();
  const errors = buyer.validateBuyerData(['phone', 'email'])
  const errorsToShow = showErrors ? errors : {};
  return contactsForm.render({ phone, email, errors: errorsToShow, valid: Object.keys(errors).length === 0 })
}

// обработка событий gallery
events.on<IProduct[]>("model-catalog:set-products", () => {
  const cards = catalog.getProducts().map(renderCardCatalog)
  gallery.render({ catalog: cards });
})

// обработка событий cards
events.on<IProduct>("render:card-catalog-select", (item) => {
  catalog.setCurrentProduct(item);
})

events.on<IProduct>("model-catalog:set-current-product", () => {
  const card = catalog.getCurrentProduct();
  if (card) {
    modal.open(renderCardPreview(card));
  }
})

events.on<IProduct>("render:card-preview-purchase", () => {
  const card = catalog.getCurrentProduct();
  if (card) {
    if (!basket.isCartProductById(card.id)) {
      basket.addProduct(card);
    }
    else {
      basket.deleteProduct(card);
    }
    modal.close();
  }
})

events.on<IProduct>("render:card-basket-delete", (item) => {
  basket.deleteProduct(item);
})

// обработка событий basket
events.on<IProduct>("model-basket:change-cart", () => {
  renderBasketView();
  renderHeader();
})

// обработка событий header
events.on('view:basket-open', () => {
  modal.open(basketView.render());
})

// обработка событий форм
events.on('view:basket-order', () => {
  modal.render({ content: renderOrderForm(false) });
})

events.on("view:form-order-submit", () => {
  modal.render({ content: renderContactsForm(false) });
})

events.on<{ field: keyof IBuyer; value: string }>("view:form-changed", ({ field, value }) => {
  buyer.setBuyerData({ [field]: value } as Partial<IBuyer>);
  console.log(buyer.getBuyerData())
});

events.on("model-buyer:data-changed", () => {
  renderOrderForm(true);
  renderContactsForm(true);
})

events.on("view:form-contacts-submit", async () => {
  try {
    const data = { ...buyer.getBuyerData(), total: basket.getCartSum(), items: basket.getCartList().map(elem => elem.id) }
    const response = await web.postOrder(data);
    modal.render({ content: successOrder.render({ order: response?.total }) });
    basket.clearCart();
    buyer.clearBuyerData();
  }
  catch (error) {
    console.error("Ошибка сервера", error);
  }
})

// обработка успешного заказа orderSuccess
events.on("view:success-order-close", () => {
  modal.close();
})