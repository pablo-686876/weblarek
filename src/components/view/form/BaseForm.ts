import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { TBuyerErrors } from "../../../types";

export interface IBaseForm {
    errors: TBuyerErrors | null;
    valid: boolean;
}

export class BaseForm<T extends IBaseForm> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected formErrors: HTMLElement;
    protected form: HTMLFormElement;
    protected formName: string;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this.formErrors = ensureElement<HTMLElement>(".form__errors", this.container);
        this.form = container.tagName === 'FORM' 
            ? container as HTMLFormElement
            : ensureElement<HTMLFormElement>(".form", this.container);
        this.formName = this.form.name;
    }

    protected set errors(message: TBuyerErrors | null) {
        this.formErrors.textContent = message ? Object.values(message).join("\n") : "";
    }

    protected set valid(isValid: boolean) {
        this.submitButton.disabled = !isValid;
    }
}