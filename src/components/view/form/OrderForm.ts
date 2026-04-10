import { TPayment } from "../../../types";
import { ensureAllElements, ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { IBaseForm, BaseForm } from "./BaseForm";

interface IOrderForm extends IBaseForm {
    payment: TPayment;
    address: string;
    isButtonBlocked?: boolean;
}

export class OrderForm extends BaseForm<IOrderForm> {
    private addressInput: HTMLInputElement;
    private paymentButtons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents, ) {
        super(container, events);

        this.submitButton.disabled = true;

        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this.paymentButtons = ensureAllElements<HTMLButtonElement>(".order__buttons button", this.container)

        this.paymentButtons.forEach((button) => {
            button.addEventListener("click", () => {
                this.paymentButtons.forEach((btn) => {
                    btn.classList.remove("button_alt-active");
                })
                button.classList.add("button_alt-active");
                this.events.emit("view:form-changed", { field: 'payment', value: button.name })
                this.updateSubmitButton(true);
            });
        })

        this.addressInput.addEventListener("input", () => {
            this.events.emit(`view:form-changed`, { field: 'address', value: this.addressInput.value })
            this.updateSubmitButton(true);
        });

        this.container.addEventListener("submit", (event) => {
            event.preventDefault();
            this.events.emit("view:form-order-submit");
        })
    }

    set address(address: string) {
        this.addressInput.value = address;
    }

    set payment(payment: TPayment) {
        this.paymentButtons.forEach((button) => {
            const buttonName = button.name;
            button.classList.toggle("button_alt-active", buttonName === payment);
        })
    }

    set isButtonBlocked(is: boolean) {
        if (is) {
            this.updateSubmitButton(false);
        }
    }
}