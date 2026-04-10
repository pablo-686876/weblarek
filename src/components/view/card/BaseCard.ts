import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { categoryMap } from "../../../utils/constants";


export interface IBaseCard {
    title: string
    price: number | null
}

export class BaseCard<T extends IBaseCard> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

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

    protected setCategoryClass(category: string, categoryElement: HTMLElement) {
        Object.values(categoryMap).forEach(cls => {
            categoryElement!.classList.remove(cls);
        });
        const categoryClass = categoryMap[category as keyof typeof categoryMap];
        if (categoryClass) {
            categoryElement.classList.add(categoryClass);
        }
    }
}

