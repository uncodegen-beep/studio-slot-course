import { ChangeDetectionStrategy, Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipDirective } from './tooltip.directive';

@Component({
    imports: [TooltipDirective],
    template: `<button
        type="button"
        appTooltip="Добавить в избранное"
    >
        +
    </button>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class HostComponent {}

function setup(): { fixture: ComponentFixture<HostComponent>; button: HTMLButtonElement } {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector('button');
    if (!button) {
        throw new Error('Кнопка не отрисована');
    }
    return { fixture, button };
}

describe('TooltipDirective', () => {
    it('при наведении показывает подсказку и связывает её через aria-describedby', async () => {
        const { fixture, button } = setup();

        button.dispatchEvent(new MouseEvent('mouseenter'));
        await fixture.whenStable();

        const tooltip = document.querySelector('[role="tooltip"]');
        expect(tooltip?.textContent).toBe('Добавить в избранное');
        expect(button.getAttribute('aria-describedby')).toBe(tooltip?.id);
    });

    it('Escape и уход курсора убирают подсказку', async () => {
        const { fixture, button } = setup();

        button.dispatchEvent(new FocusEvent('focusin'));
        await fixture.whenStable();
        button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await fixture.whenStable();

        expect(document.querySelector('[role="tooltip"]')).toBeNull();
        expect(button.hasAttribute('aria-describedby')).toBe(false);
    });

    it('уничтожение компонента убирает видимую подсказку', () => {
        const { fixture, button } = setup();

        button.dispatchEvent(new MouseEvent('mouseenter'));
        fixture.destroy();

        expect(document.querySelector('[role="tooltip"]')).toBeNull();
    });
});
