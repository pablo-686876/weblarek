import { IEvents } from "../base/Events";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface IHeader {
    counter: number;
}

export class Header extends Component<IHeader> {
    protected basketButton: HTMLButtonElement;
    protected basketCounter: HTMLElement;

    constructor(container: HTMLElement, private events: IEvents) {
        super(container);

        this.basketButton = ensureElement<HTMLButtonElement>(".header__basket", this.container);
        this.basketCounter = ensureElement<HTMLElement>(".header__basket-counter", this.container);

        this.basketButton.addEventListener('click', () => {
            this.events.emit('view:basket-open');
        })
    }

    set counter(value: number) {
        this.basketCounter.textContent = value.toString();
    }

}