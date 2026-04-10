import "./scss/styles.scss";
import { WebApi } from "./components/models/WebApi";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { ProductCatalog } from "./components/models/ProductCatalog";
import { Basket } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";
import { IProduct, TBuyerErrors, IBuyer} from "./types";
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
const buyer = new Buyer();

// создание шаблонов
const cardCatalogTemplate = cloneTemplate<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = cloneTemplate<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = cloneTemplate<HTMLTemplateElement>("#card-basket");
const basketViewTemplate = cloneTemplate<HTMLTemplateElement>("#basket");
const successOrderTemplate = cloneTemplate<HTMLTemplateElement>("#success");
const orderFormTemplate = cloneTemplate<HTMLTemplateElement>("#order");
const contactsFormTemplate = cloneTemplate<HTMLTemplateElement>("#contacts");

// создание экземпляров представлений
const header = new Header(ensureElement<HTMLElement>(".header"), events);
const modal = new Modal(ensureElement<HTMLElement>(".modal"));
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));
const orderForm = new OrderForm(orderFormTemplate.cloneNode(true) as HTMLFormElement, events);
const contactsForm = new ContactsForm(contactsFormTemplate.cloneNode(true) as HTMLFormElement, events);
const successOrder = new SuccessOrder(successOrderTemplate.cloneNode(true) as HTMLElement, events);
const basketView = new BasketView(basketViewTemplate.cloneNode(true) as HTMLElement, events);

async function init() {
  try {
    const apiCatalog = await web.getProductList();
    catalog.setProducts(apiCatalog);
  } catch (error) {
    console.error("Ошибка инициализации", error);
  }
}

init();

// вспомогательные функции рендера
function renderCardCatalog(item: IProduct): HTMLElement {
  const card = new CardCatalog(cardCatalogTemplate.cloneNode(true) as HTMLElement, {
    onClick: () => {
      events.emit("render:card-catalog-select", item)
    }
  });
  return card.render(item);
}

function renderCardPreview(item: IProduct): HTMLElement {
  const card = new CardPreview(cardPreviewTemplate.cloneNode(true) as HTMLElement, {
    onClick: () => {
      
      events.emit("render:card-preview-purchase", item)
    }
  });
  return card.render({...item, isPrice: item.price, inBasket: basket.isCartProductById(item.id)});
}

function renderCardBasket(item: IProduct, index: number): HTMLElement {
  const card = new CardBasket(cardBasketTemplate.cloneNode(true) as HTMLElement, {
    onClick: () => {
      events.emit("render:card-basket-delete", item)
    }
  });
  return card.render({...item, index: index + 1});
}

function renderBasketView(): HTMLElement {
  const cards = basket.getCartList().map(renderCardBasket);
  return basketView.render({price: basket.getCartSum(), items: cards, canOrder: cards});
}

function renderHeader(): HTMLElement {
  return header.render({counter: basket.getCartProductCount()});
}

function renderOrderForm(errors?: TBuyerErrors, isButtonBlocked?: boolean): HTMLElement {
  const {payment, address} = buyer.getBuyerData();
  if (errors && isButtonBlocked) {
    return orderForm.render({payment, address, errors, isButtonBlocked})
  }
  else {
    return orderForm.render({payment, address, errors: null})
  }
}

function renderContactsForm(errors?: TBuyerErrors, isButtonBlocked?: boolean): HTMLElement {
  const {phone, email} = buyer.getBuyerData();
  if (errors && isButtonBlocked) {
    return contactsForm.render({phone, email, errors, isButtonBlocked})
  }
  else {
    return contactsForm.render({phone, email, errors: null})
  }
}

function renderSuccessOrder(): HTMLElement {
  return successOrder.render({order: basket.getCartSum()});

}

// обработка событий gallery
events.on<IProduct[]>("model-catalog:set-products", () => {
  const cards = catalog.getProducts().map(renderCardCatalog)
  gallery.render({catalog: cards});
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

events.on<IProduct>("render:card-preview-purchase", (item) => {
  if (!basket.isCartProductById(item.id)) {
    basket.addProduct(item);
  }
  else {
    basket.deleteProduct(item);
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
  modal.open(renderBasketView());
})

// обработка событий форм
events.on('view:basket-order', () => {
  modal.render({content: renderOrderForm()});
})

events.on<{ field: keyof IBuyer; value: string }>("view:form-changed", ({ field, value }) => {
    buyer.setBuyerData({ [field]: value } as Partial<IBuyer>);
    console.log(buyer.getBuyerData())
});

events.on("view:form-order-submit", () => {
  const errors = buyer.validateBuyerData(['payment', 'address'])
  if (Object.keys(errors).length === 0) {
    modal.render({content: renderOrderForm()});
    modal.render({content: renderContactsForm()});
  }
  else {
    modal.render({content: renderOrderForm(errors, true)});
  }
})

events.on("view:form-contacts-submit", () => {
  const errors = buyer.validateBuyerData(['email', 'phone'])
  if (Object.keys(errors).length === 0) {
    modal.render({content: renderSuccessOrder()});
    basket.clearCart();
    buyer.clearBuyerData();
    renderHeader();
    contactsForm.reset();
    orderForm.reset();
  }
  else {
    modal.render({content: renderContactsForm(errors, true)});
  }
})

// обработка успешного заказа orderSuccess
events.on("view:success-order-close", () => {
  modal.close();
})