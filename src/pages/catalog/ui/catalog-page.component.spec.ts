import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AnalyticsService } from '@shared/lib/analytics/analytics.service';

import { CatalogPageComponent } from './catalog-page.component';

interface Setup {
    root: HTMLElement;
    showState: (label: string) => Promise<void>;
    listAction: (label: string) => Promise<void>;
    items: () => HTMLLIElement[];
}

function setup(): Setup {
    const fixture = TestBed.createComponent(CatalogPageComponent);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;

    const clickIn = async (group: string, label: string): Promise<void> => {
        const button = [...root.querySelectorAll<HTMLButtonElement>(`${group} button`)].find(
            (b) => b.textContent?.trim() === label,
        );
        button?.click();
        await fixture.whenStable();
    };

    return {
        root,
        showState: (label) => clickIn('.demo-states', label),
        listAction: (label) => clickIn('.list-actions', label),
        items: () => [...root.querySelectorAll<HTMLLIElement>('app-studio-list li')],
    };
}

describe('CatalogPageComponent', () => {
    it('по умолчанию показывает рекомендуемую студию и список', () => {
        const { root } = setup();

        expect(root.querySelector('h2')?.textContent).toContain('Рекомендуем: Sound Garden');
        expect(root.querySelectorAll('app-studio-list li')).toHaveLength(3);
    });

    it('загрузка — спиннер вместо списка', async () => {
        const { root, showState } = setup();
        await showState('Загрузка');

        expect(root.querySelector('app-spinner')).not.toBeNull();
        expect(root.querySelector('app-studio-list')).toBeNull();
    });

    it('ошибка — сообщение с role="alert"', async () => {
        const { root, showState } = setup();
        await showState('Ошибка');

        expect(root.querySelector('[role="alert"]')?.textContent).toContain('Сервер не ответил');
    });

    it('пустой каталог — шаблон emptyState', async () => {
        const { root, showState } = setup();

        await showState('Пусто');

        expect(root.querySelector('.empty')?.textContent).toContain('Каталог пока пуст');
    });

    it('track: новые объекты с теми же id не пересоздают <li>', async () => {
        const { items, listAction } = setup();
        const before = items();

        await listAction('Обновить данные');

        expect(items()).toHaveLength(before.length);
        items().forEach((item, i) => expect(item).toBe(before[i]));
    });

    it('track: при смене порядка <li> переставляются, а не создаются', async () => {
        const { items, listAction } = setup();
        const [first, , last] = items();

        await listAction('Обратный порядок');

        expect(items()[0]).toBe(last);
        expect(items()[2]).toBe(first);
        expect(items()[0]?.textContent).toContain('Volga Records');
    });

    it('избранное: событие карточки обрабатывает страница, обе карточки студии обновляются', async () => {
        const fixture = TestBed.createComponent(CatalogPageComponent);
        fixture.detectChanges();
        const root = fixture.nativeElement as HTMLElement;
        const favoriteButtons = (): HTMLButtonElement[] => [
            ...root.querySelectorAll<HTMLButtonElement>(
                'app-studio-card [aria-pressed][aria-label*="Sound Garden"]',
            ),
        ];

        favoriteButtons()[0]?.click();
        await fixture.whenStable();

        expect(root.querySelector('.favorites-count')?.textContent).toContain('В избранном: 1');
        expect(favoriteButtons().map((b) => b.getAttribute('aria-pressed'))).toEqual([
            'true',
            'true',
        ]);
    });

    it('computed: поиск фильтрует список и обновляет счётчик', async () => {
        const { root, items } = setup();
        const input = root.querySelector<HTMLInputElement>('input[type="search"]');
        if (!input) {
            throw new Error('Нет поля поиска');
        }

        input.value = 'казань';
        input.dispatchEvent(new Event('input'));
        await TestBed.inject(ApplicationRef).whenStable();

        expect(items()).toHaveLength(1);
        expect(items()[0]?.textContent).toContain('Volga Records');
        expect(root.querySelector('.found')?.textContent).toContain('Найдено: 1');
    });

    it('по запросу без совпадений список показывает @empty', async () => {
        const { root, items } = setup();
        const input = root.querySelector<HTMLInputElement>('input[type="search"]');
        if (!input) {
            throw new Error('Нет поля поиска');
        }

        input.value = 'нет такой студии';
        input.dispatchEvent(new Event('input'));
        await TestBed.inject(ApplicationRef).whenStable();

        expect(items()).toHaveLength(1);
        expect(items()[0]?.classList).toContain('empty');
        expect(root.querySelector('.found')?.textContent).toContain('Найдено: 0');
    });

    it('фильтр по городу и сброс фильтров', async () => {
        const { root, items } = setup();
        const select = root.querySelector<HTMLSelectElement>('.filters select');
        if (!select) {
            throw new Error('Нет фильтра города');
        }

        select.value = 'Казань';
        select.dispatchEvent(new Event('change'));
        await TestBed.inject(ApplicationRef).whenStable();
        expect(items()).toHaveLength(1);

        root.querySelector<HTMLButtonElement>('.filters button')?.click();
        await TestBed.inject(ApplicationRef).whenStable();
        expect(items()).toHaveLength(3);
    });

    it('аналитика: equal и untracked не дают лишних событий поиска', async () => {
        const { root } = setup();
        const appRef = TestBed.inject(ApplicationRef);
        const searches = (): number =>
            TestBed.inject(AnalyticsService)
                .events()
                .filter((event) => event.name === 'catalog_search').length;
        await appRef.whenStable();
        const initial = searches();

        // фильтры уже по умолчанию: новый, но равный объект — эффект не перезапускается
        root.querySelector<HTMLButtonElement>('.filters button')?.click();
        await appRef.whenStable();
        expect(searches()).toBe(initial);

        // избранное прочитано через untracked — тоже не повод для события поиска
        root.querySelector<HTMLButtonElement>('app-studio-card [aria-pressed]')?.click();
        await appRef.whenStable();
        expect(searches()).toBe(initial);

        const input = root.querySelector<HTMLInputElement>('input[type="search"]');
        if (input) {
            input.value = 'volga';
            input.dispatchEvent(new Event('input'));
        }
        await appRef.whenStable();
        expect(searches()).toBe(initial + 1);
    });

    it('linkedSignal: первый зал по умолчанию, ручной выбор переживает обновление данных', async () => {
        const { root, listAction } = setup();
        const appRef = TestBed.inject(ApplicationRef);
        const radios = (): HTMLInputElement[] => [
            ...root.querySelectorAll<HTMLInputElement>('.rooms input[type="radio"]'),
        ];
        const checked = (): number => radios().findIndex((radio) => radio.checked);

        expect(checked()).toBe(0); // по умолчанию — первый зал

        radios()[1]?.click();
        await appRef.whenStable();
        expect(checked()).toBe(1);

        // новые объекты студий: зал с тем же id есть в списке — выбор сохранился
        await listAction('Обновить данные');
        expect(checked()).toBe(1);
    });
});
