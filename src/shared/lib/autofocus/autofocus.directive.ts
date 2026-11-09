import { Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/** Ставит фокус на элемент после первого рендера: <input appAutofocus /> */
@Directive({ selector: '[appAutofocus]' })
export class AutofocusDirective {
    constructor() {
        const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
        // Фокус возможен, только когда элемент уже в DOM, и только в браузере — не на сервере (SSR)
        afterNextRender(() => element.focus());
    }
}
