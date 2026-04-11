import { Component } from "../base/Component";

interface IGallery {
    catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
    constructor(container: HTMLElement) {
        super(container);
    }

    protected set catalog(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}