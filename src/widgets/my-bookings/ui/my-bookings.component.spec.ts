import { TestBed } from '@angular/core/testing';

import { MyBookingsComponent } from './my-bookings.component';

function render(): HTMLElement {
    const fixture = TestBed.createComponent(MyBookingsComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
}

describe('MyBookingsComponent', () => {
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

        expect(first?.querySelector('s')?.textContent).toBe('4500 ₽');
        expect(first?.querySelector('strong')?.textContent).toBe('4050 ₽');
    });

    it('без скидки показывается только общая сумма', () => {
        const prices = render().querySelectorAll('.booking__price');

        expect(prices[1]?.textContent?.trim()).toBe('2400 ₽');
        expect(prices[1]?.querySelector('s')).toBeNull();
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
