import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";

export interface IBaseCard {
    title: string
    price: number | null
}

export class BaseCard<T extends IBaseCard> extends Component<T> {
    private titleElement: HTMLElement;
    private priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>(".card__title", this.container);
        this.priceElement = ensureElement<HTMLElement>(".card__price", this.container);
    }

    protected set price(price: number | null) {
        this.priceElement.textContent = price ? `${price.toString()} синапсов` : "Бесценно";
    }

    protected set title(title: string) {
        this.titleElement.textContent = title;
    }
}

