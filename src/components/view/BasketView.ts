import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IBasketView {
    price: number;
    items: HTMLElement[];
    canOrder: HTMLElement[];
}

export class BasketView extends Component<IBasketView> {
    private totalPrice: HTMLElement;
    private emptyElement: HTMLElement;
    private orderButton: HTMLButtonElement;
    private basketList: HTMLElement;

    constructor(container: HTMLElement, private events: IEvents) {
        super(container);

        this.orderButton = ensureElement<HTMLButtonElement>(".basket__button", this.container);
        this.totalPrice = ensureElement<HTMLElement>(".basket__price", this.container);
        this.basketList = ensureElement<HTMLElement>(".basket__list", this.container);
        this.emptyElement = document.createElement("li");
        this.emptyElement.className = 'basket__empty';
        this.emptyElement.textContent = 'Корзина пуста';

        this.orderButton.addEventListener("click", () => {
            this.events.emit('view:basket-order')
        })

    }
    protected set items(items: HTMLElement[]) {
        if (items.length === 0) {
            this.basketList.replaceChildren();
            this.basketList.append(this.emptyElement);
        }
        else {
            this.basketList.replaceChildren(...items);
        }
    }

    protected set price(price: number) {
        this.totalPrice.textContent = `${price.toString()} синапсов`;
    }

    protected set canOrder(items: HTMLElement[]) {
        if (items.length === 0) {
            this.orderButton.disabled = true;
        }
        else {
            this.orderButton.disabled = false;
        }
    }
}