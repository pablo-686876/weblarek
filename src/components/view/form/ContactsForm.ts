import { BaseForm, IBaseForm } from "./BaseForm";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

interface IContactForm extends IBaseForm {
    email: string;
    phone: string;
}

export class ContactsForm extends BaseForm<IContactForm> {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this.emailInput.addEventListener("input", () => {
            this.events.emit("view:form-changed", { field: 'email', value: this.emailInput.value });
        });

        this.phoneInput.addEventListener("input", () => {
            this.events.emit("view:form-changed", { field: 'phone', value: this.phoneInput.value });
        });
    }

    protected set email(email: string) {
        this.emailInput.value = email;
    }

    protected set phone(phone: string) {
        this.phoneInput.value = phone;
    }
}