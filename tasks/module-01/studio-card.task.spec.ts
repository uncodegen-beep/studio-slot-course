// Задание модуля 01: карточка студии на универсальной app-card.
// Тест проверяет результат: разметку и поведение, а не то, как устроен ваш код внутри.
import { TestBed } from '@angular/core/testing';

import { DEMO_STUDIOS } from '../../src/entities/studio/model/studios.demo';
import { StudioCardComponent } from '../../src/entities/studio/ui/studio-card/studio-card.component';
import { provideRuLocale } from '../../src/shared/lib/locale/provide-ru-locale';
import type { Studio } from '../../src/shared/model';

const [OPEN, , CLOSED] = DEMO_STUDIOS as [Studio, Studio, Studio];

function render(
    studio: Studio,
    inputs: { favorite?: boolean; compact?: boolean } = {},
): HTMLElement {
    const fixture = TestBed.createComponent(StudioCardComponent);
    fixture.componentRef.setInput('studio', studio);
    fixture.componentRef.setInput('favorite', inputs.favorite ?? false);
    fixture.componentRef.setInput('compact', inputs.compact ?? false);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
}

describe('Модуль 01 · карточка студии', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [provideRuLocale()] });
    });

    it('построена на app-card: название — в слоте заголовка', () => {
        const host = render(OPEN);

        expect(host.querySelector('app-card')).not.toBeNull();
        expect(host.querySelector('app-card .card__header')?.textContent).toContain(OPEN.name);
    });

    it('цена через pipe валюты, рейтинг с одним знаком после запятой', () => {
        const text = render(OPEN).textContent ?? '';

        expect(text).toMatch(/1\s500\s₽/);
        expect(text).toContain('4,6');
    });

    it('кнопка избранного — переключатель с подписью', () => {
        const off = render(OPEN).querySelector('[aria-pressed]');
        const on = render(OPEN, { favorite: true }).querySelector('[aria-pressed]');

        expect(off?.getAttribute('aria-pressed')).toBe('false');
        expect(on?.getAttribute('aria-pressed')).toBe('true');
        expect(off?.getAttribute('aria-label')).toContain(OPEN.name);
        expect(on?.getAttribute('aria-label')).not.toBe(off?.getAttribute('aria-label'));
    });

    it('закрытая студия: класс closed на хосте и пояснение', () => {
        const host = render(CLOSED);

        expect(host.classList).toContain('closed');
        expect(host.textContent).toContain('не принимает бронирования');
    });

    it('компактный вариант без обложки', () => {
        const host = render(OPEN, { compact: true });

        expect(host.classList).toContain('compact');
        expect(host.querySelector('img')).toBeNull();
        expect(render(OPEN).querySelector('img')?.getAttribute('loading')).toBe('lazy');
    });
});
