import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface ISuccessOrder {
    order: number;
}

export class SuccessOrder extends Component<ISuccessOrder> {
    private orderField: HTMLElement;
    private submitOrderButton: HTMLButtonElement;

    constructor(container: HTMLElement, private events: IEvents) {
        super(container);

        this.orderField = ensureElement<HTMLElement>(".order-success__description", this.container);
        this.submitOrderButton = ensureElement<HTMLButtonElement>(".order-success__close", this.container);

        this.submitOrderButton.addEventListener("click", () => {
            this.events.emit("view:success-order-close");
        })
    }

    set order(value: number) {
        this.orderField.textContent = `Списано ${value.toString()} синапсов`
    }
}