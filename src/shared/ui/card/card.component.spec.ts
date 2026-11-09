import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';

@Component({
    imports: [CardComponent],
    template: `
        <app-card id="full">
            <h3 cardTitle>Sound Garden</h3>
            <p>Москва, от 1500 ₽/час</p>
            <button
                cardActions
                type="button"
            >
                Забронировать
            </button>
        </app-card>

        <app-card id="bare">
            <p>Только содержимое</p>
        </app-card>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class HostComponent {}

function render(): HTMLElement {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
}

describe('CardComponent', () => {
    it('раскладывает контент по именованным слотам', () => {
        const card = render().querySelector('#full');

        expect(card?.querySelector('.card__header h3')?.textContent).toBe('Sound Garden');
        expect(card?.querySelector('.card__body p')?.textContent).toContain('1500 ₽/час');
        expect(card?.querySelector('.card__actions button')?.textContent).toContain(
            'Забронировать',
        );
    });

    it('без заголовка показывает запасное содержимое', () => {
        const card = render().querySelector('#bare');

        expect(card?.querySelector('.card__untitled')?.textContent).toBe('Без названия');
        expect(card?.querySelector('.card__body p')?.textContent).toBe('Только содержимое');
    });
});
