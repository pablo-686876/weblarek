import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    private closeButton: HTMLButtonElement;
    private modalContent: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.closeButton = ensureElement<HTMLButtonElement>(".modal__close", this.container);
        this.modalContent = ensureElement<HTMLElement>(".modal__content", this.container);

        this.closeButton.addEventListener("click", () => {
            this.close();
        })

        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
            }
        });
    }

    protected set content(content: HTMLElement) {
        this.modalContent.replaceChildren(content);
    }

    open(content: HTMLElement) {
        this.content = content;
        this.container.classList.add('modal_active');
    }

    close() {
        this.container.classList.remove('modal_active');
    }
}