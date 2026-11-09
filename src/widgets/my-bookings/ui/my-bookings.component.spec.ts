import { TestBed } from '@angular/core/testing';

import { provideRuLocale } from '@shared/lib/locale/provide-ru-locale';

import { MyBookingsComponent } from './my-bookings.component';

// \s в ожиданиях: русская локаль разделяет разряды и ₽ неразрывным пробелом

function render(): HTMLElement {
    const fixture = TestBed.createComponent(MyBookingsComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
}

describe('MyBookingsComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [provideRuLocale()] });
    });

    it('@switch выбирает бейдж по статусу', () => {
        const badges = [...render().querySelectorAll('.badge')];

        expect(badges.map((badge) => badge.className)).toEqual([
            'badge badge--ok',
            'badge badge--wait',
            'badge badge--off',
        ]);
        expect(badges.map((badge) => badge.textContent?.trim())).toEqual([
            'Подтверждено',
            'Ожидает',
            'Отменено',
        ]);
    });

    it('@let: цена со скидкой считается от общей суммы', () => {
        const [first] = render().querySelectorAll('.booking__price');

        expect(first?.querySelector('s')?.textContent).toMatch(/^4\s500\s₽$/);
        expect(first?.querySelector('strong')?.textContent).toMatch(/^4\s050\s₽$/);
    });

    it('без скидки показывается только общая сумма', () => {
        const prices = render().querySelectorAll('.booking__price');

        expect(prices[1]?.textContent?.trim()).toMatch(/^2\s400\s₽$/);
        expect(prices[1]?.querySelector('s')).toBeNull();
    });

    it('date и plural: дата по-русски и склонение часов', () => {
        const times = [...render().querySelectorAll('.booking__time')].map((p) =>
            p.textContent?.replace(/\s+/g, ' ').trim(),
        );

        expect(times).toEqual([
            '14 ноября, 18:00 · 3 часа',
            '21 ноября, 12:00 · 2 часа',
            '2 ноября, 10:00 · 1 час',
        ]);
    });

    it('ng-content: название студии попадает в слот заголовка карточки', () => {
        const titles = render().querySelectorAll('app-card .card__header .booking__studio');

        expect(titles[0]?.textContent?.trim()).toBe('Sound Garden');
    });

    it('кнопка «Отменить» только у ожидающего бронирования и меняет статус', async () => {
        const fixture = TestBed.createComponent(MyBookingsComponent);
        fixture.detectChanges();
        const root = fixture.nativeElement as HTMLElement;
        const buttons = root.querySelectorAll<HTMLButtonElement>('.card__actions button');

        expect(buttons).toHaveLength(1);

        buttons[0]?.click();
        await fixture.whenStable();

        expect(root.querySelectorAll('.badge--off')).toHaveLength(2);
        expect(root.querySelector('.card__actions button')).toBeNull();
    });
});
