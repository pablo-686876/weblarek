import { ensureElement } from "../../../utils/utils";
import { IBaseCard } from "./BaseCard";
import { BaseCard } from "./BaseCard";
import { ICardActions } from "../../../types";
import { CDN_URL } from "../../../utils/constants";

interface ICardPreview extends IBaseCard {
    isPrice: number | null;
    description: string;
    image: string;
    category: string;
    inBasket: boolean;
}

export class CardPreview extends BaseCard<ICardPreview> {
    private purchaseButton: HTMLButtonElement;
    protected categoryElement: HTMLElement;
    protected descriptionElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    private _inBasket: boolean = false;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.purchaseButton = ensureElement<HTMLButtonElement>(".card__button", this.container);
        this.categoryElement = ensureElement<HTMLElement>(".card__category", this.container);
        this.descriptionElement = ensureElement<HTMLElement>(".card__text", this.container);
        this.imageElement = ensureElement<HTMLImageElement>(".card__image", this.container);

        if (actions?.onClick) {
          this.purchaseButton.addEventListener("click", () => {
            actions?.onClick?.();
          });
        }

        this.purchaseButton.addEventListener("click", () => {
            this._inBasket = !this._inBasket;
            this.purchaseButton.textContent = this._inBasket 
                ? "Удалить из корзины" 
                : "В корзину";
        });
    }

    set image(src: string) {
        this.setImage(this.imageElement, CDN_URL + src.replace('.svg', '.png'));
    }

    set category(category: string) {
        this.categoryElement.textContent = category;
        this.setCategoryClass(category, this.categoryElement);
    }

    set description(description: string) {
        this.descriptionElement.textContent = description;
    }

    set isPrice(price: number | null) {
        if (!price) {
            this.purchaseButton.disabled = true;
        }
    }

    set inBasket(isIn: boolean) {
        this._inBasket = isIn;
        this.purchaseButton.textContent = isIn 
            ? "Удалить из корзины" 
            : "В корзину";
    }
}