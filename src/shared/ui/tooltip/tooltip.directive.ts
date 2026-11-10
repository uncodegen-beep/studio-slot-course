import { DOCUMENT } from '@angular/common';
import { DestroyRef, Directive, ElementRef, Renderer2, inject, input } from '@angular/core';

let nextId = 0;

/**
 * Подсказка при наведении и при фокусе с клавиатуры: <button appTooltip="В избранное">.
 * Элемент подсказки создаём в <body>, чтобы его не обрезал overflow: hidden родителя
 */
@Directive({
    selector: '[appTooltip]',
    host: {
        '[attr.aria-describedby]': 'visible ? tooltipId : null',
        '(mouseenter)': 'show()',
        '(mouseleave)': 'hide()',
        '(focusin)': 'show()',
        '(focusout)': 'hide()',
        '(keydown.escape)': 'hide()',
    },
})
export class TooltipDirective {
    /** alias: снаружи вход называется как селектор — appTooltip="текст" */
    readonly text = input.required<string>({ alias: 'appTooltip' });

    protected visible = false;
    /** Счётчик, а не случайный id: на сервере и в браузере id совпадут (SSR) */
    protected readonly tooltipId = `app-tooltip-${nextId++}`;

    private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    private readonly renderer = inject(Renderer2);
    private readonly document = inject(DOCUMENT);
    private tooltip: HTMLElement | null = null;

    constructor() {
        // Компонент удалили, пока подсказка видна, — убираем и её (подробно о DestroyRef — урок 20)
        inject(DestroyRef).onDestroy(() => this.hide());
    }

    protected show(): void {
        if (this.tooltip) {
            return;
        }
        const tooltip = this.renderer.createElement('div') as HTMLElement;
        this.renderer.setAttribute(tooltip, 'role', 'tooltip');
        this.renderer.setAttribute(tooltip, 'id', this.tooltipId);
        this.renderer.addClass(tooltip, 'app-tooltip');
        this.renderer.appendChild(tooltip, this.renderer.createText(this.text()));

        const rect = this.host.getBoundingClientRect();
        this.renderer.setStyle(tooltip, 'top', `${rect.bottom + 6}px`);
        this.renderer.setStyle(tooltip, 'left', `${rect.left}px`);

        this.renderer.appendChild(this.document.body, tooltip);
        this.tooltip = tooltip;
        this.visible = true;
    }

    protected hide(): void {
        if (!this.tooltip) {
            return;
        }
        this.renderer.removeChild(this.document.body, this.tooltip);
        this.tooltip = null;
        this.visible = false;
    }
}
