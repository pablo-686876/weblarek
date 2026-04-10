import { BaseForm, IBaseForm } from "./BaseForm";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

interface IContactForm extends IBaseForm {
    email: string;
    phone: string;
    isButtonBlocked?: boolean;
}

export class ContactsForm extends BaseForm<IContactForm> {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.submitButton.disabled = true;

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this.emailInput.addEventListener("input", () => {
            this.events.emit("view:form-changed", { field: 'email', value: this.emailInput.value });
            this.updateSubmitButton(true);
        });

        this.phoneInput.addEventListener("input", () => {
            this.events.emit("view:form-changed", { field: 'phone', value: this.phoneInput.value });
            this.updateSubmitButton(true);
        });

        this.container.addEventListener("submit", (event) => {
            event.preventDefault();
            this.events.emit("view:form-contacts-submit");
        })
    }

    set email(email: string) {
            this.emailInput.value = email;
        }
    
    set phone(phone: string) {
            this.phoneInput.value = phone;
    }

    set isButtonBlocked(is: boolean) {
        if (is) {
            this.updateSubmitButton(false);
        }
    }
}