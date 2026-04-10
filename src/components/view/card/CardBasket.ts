import { ensureElement } from "../../../utils/utils";
import { IBaseCard } from "./BaseCard";
import { BaseCard } from "./BaseCard";
import { ICardActions } from "../../../types";


interface ICardBasket extends IBaseCard {
    index: number;
}

export class CardBasket extends BaseCard<ICardBasket> {
    private deleteButton: HTMLButtonElement;
    private cardIndex: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.deleteButton = ensureElement<HTMLButtonElement>(".basket__item-delete", this.container);
        this.cardIndex = ensureElement<HTMLElement>(".basket__item-index", this.container);

        if (actions?.onClick) {
            this.deleteButton.addEventListener("click", () => {
                actions?.onClick?.();
            });
        }
    }

    set index(value: number) {
        this.cardIndex.textContent = value.toString();
    }

}