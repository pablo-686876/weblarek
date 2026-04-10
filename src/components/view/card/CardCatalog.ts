import { IBaseCard } from "./BaseCard";
import { BaseCard } from "./BaseCard";
import { ICardActions } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { CDN_URL } from "../../../utils/constants";

interface ICardCatalog extends IBaseCard {
    image: string;
    category: string;
}

export class CardCatalog extends BaseCard<ICardCatalog> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>(".card__category", this.container);
        this.imageElement = ensureElement<HTMLImageElement>(".card__image", this.container);

        if (actions?.onClick) {
            this.container.addEventListener("click", () => {
                actions?.onClick?.();
            });
        }
    }

    set image(src: string) {
        this.setImage(this.imageElement, CDN_URL + src.replace('.svg', '.png'));
    }

    set category(category: string) {
        this.categoryElement.textContent = category;
        this.setCategoryClass(category, this.categoryElement);
    }
}