import { IBaseCard } from "./BaseCard";
import { BaseCard } from "./BaseCard";
import { ICardActions } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { CDN_URL } from "../../../utils/constants";
import { categoryMap } from "../../../utils/constants";

interface ICardCatalog extends IBaseCard {
    image: string;
    category: string;
}

export class CardCatalog extends BaseCard<ICardCatalog> {
    private categoryElement: HTMLElement;
    private imageElement: HTMLImageElement;

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

    private setCategoryClass(category: string, categoryElement: HTMLElement) {
        Object.values(categoryMap).forEach(cls => {
            categoryElement!.classList.remove(cls);
        });
        const categoryClass = categoryMap[category as keyof typeof categoryMap];
        if (categoryClass) {
            categoryElement.classList.add(categoryClass);
        }
    }

    protected set image(src: string) {
        this.setImage(this.imageElement, CDN_URL + src.replace('.svg', '.png'));
    }

    protected set category(category: string) {
        this.categoryElement.textContent = category;
        this.setCategoryClass(category, this.categoryElement);
    }
}