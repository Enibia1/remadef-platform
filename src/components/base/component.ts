/* ==========================================================
   REMADEF PLATFORM
   Base Component
   File: src/components/base/component.ts
========================================================== */

export interface ComponentOptions {
    id?: string;
    className?: string;
    tag?: keyof HTMLElementTagNameMap;
    attributes?: Record<string, string>;
}

export default abstract class Component {

    protected element: HTMLElement;

    constructor(options: ComponentOptions = {}) {

        this.element = document.createElement(
            options.tag ?? "div"
        );

        if (options.id) {
            this.element.id = options.id;
        }

        if (options.className) {
            this.element.className = options.className;
        }

        if (options.attributes) {

            Object.entries(options.attributes).forEach(
                ([key, value]) => {

                    this.element.setAttribute(key, value);

                }
            );

        }

    }

    /* ==========================================================
       ROOT ELEMENT
    ========================================================== */

    getEl(): HTMLElement {

        return this.element;

    }

    /* ==========================================================
       HTML
    ========================================================== */

    html(content: string): this {

        this.element.innerHTML = content;

        return this;

    }

    /* ==========================================================
       TEXT
    ========================================================== */

    text(content: string): this {

        this.element.textContent = content;

        return this;

    }

    /* ==========================================================
       APPEND
    ========================================================== */

    append(
        child: HTMLElement | Component
    ): this {

        this.element.appendChild(
            child instanceof Component
                ? child.getEl()
                : child
        );

        return this;

    }

    /* ==========================================================
       CLASS
    ========================================================== */

    addClass(...classes: string[]): this {

        this.element.classList.add(...classes);

        return this;

    }

    removeClass(...classes: string[]): this {

        this.element.classList.remove(...classes);

        return this;

    }

    toggleClass(
        className: string,
        force?: boolean
    ): this {

        this.element.classList.toggle(
            className,
            force
        );

        return this;

    }

    /* ==========================================================
       ATTRIBUTES
    ========================================================== */

    attr(
        key: string,
        value: string
    ): this {

        this.element.setAttribute(
            key,
            value
        );

        return this;

    }

    /* ==========================================================
       EVENTS
    ========================================================== */

    on<K extends keyof HTMLElementEventMap>(
        event: K,
        handler: (
            e: HTMLElementEventMap[K]
        ) => void
    ): this {

        this.element.addEventListener(
            event,
            handler as EventListener
        );

        return this;

    }

    off<K extends keyof HTMLElementEventMap>(
        event: K,
        handler: (
            e: HTMLElementEventMap[K]
        ) => void
    ): this {

        this.element.removeEventListener(
            event,
            handler as EventListener
        );

        return this;

    }

    /* ==========================================================
       VISIBILITY
    ========================================================== */

    show(): this {

        this.element.hidden = false;

        return this;

    }

    hide(): this {

        this.element.hidden = true;

        return this;

    }

    /* ==========================================================
       DESTROY
    ========================================================== */

    destroy(): void {

        this.element.remove();

    }

}
