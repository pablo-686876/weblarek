import { ensureElement } from "../../../utils/utils";
import { IBaseCard } from "./BaseCard";
import { BaseCard } from "./BaseCard";
import { ICardActions } from "../../../types";
import { CDN_URL } from "../../../utils/constants";
import { categoryMap } from "../../../utils/constants";

interface ICardPreview extends IBaseCard {
    description: string;
    image: string;
    category: string;
    buttonText: string;
    isActive: boolean;
}

export class CardPreview extends BaseCard<ICardPreview> {
    private purchaseButton: HTMLButtonElement;
    private categoryElement: HTMLElement;
    private descriptionElement: HTMLElement;
    private imageElement: HTMLImageElement;

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

    protected set description(description: string) {
        this.descriptionElement.textContent = description;
    }

    protected set buttonText(text: string) {
        this.purchaseButton.textContent = text;
    }

    protected set isActive(is: boolean) {
        if (!is) {
            this.purchaseButton.disabled = true;
        }
    }
}