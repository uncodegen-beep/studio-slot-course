import { TestBed } from '@angular/core/testing';

import { CatalogPageComponent } from './catalog-page.component';

function setup(): { root: HTMLElement; showState: (label: string) => Promise<void> } {
    const fixture = TestBed.createComponent(CatalogPageComponent);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;

    const showState = async (label: string): Promise<void> => {
        const button = [...root.querySelectorAll<HTMLButtonElement>('.demo-states button')].find(
            (b) => b.textContent?.trim() === label,
        );
        button?.click();
        await fixture.whenStable();
    };

    return { root, showState };
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
});
