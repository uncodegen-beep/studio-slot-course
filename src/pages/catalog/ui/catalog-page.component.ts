import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DEMO_STUDIOS } from '@entities/studio/model/studios.demo';
import { StudioCardComponent } from '@entities/studio/ui/studio-card/studio-card.component';
import { StudioListComponent } from '@entities/studio/ui/studio-list/studio-list.component';

import type { Studio } from '@shared/model';
import { SpinnerComponent } from '@shared/ui/spinner/spinner.component';

/** Состояние, которое показываем кнопками демо — пока нет настоящей загрузки (модуль 06) */
type DemoState = 'loading' | 'error' | 'empty' | 'data';

@Component({
    selector: 'app-catalog-page',
    imports: [NgTemplateOutlet, SpinnerComponent, StudioCardComponent, StudioListComponent],
    templateUrl: './catalog-page.component.html',
    styleUrl: './catalog-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogPageComponent {
    protected loading = false;
    protected error: string | null = null;
    protected studios: Studio[] = DEMO_STUDIOS;

    protected readonly demoStates: { value: DemoState; label: string }[] = [
        { value: 'loading', label: 'Загрузка' },
        { value: 'error', label: 'Ошибка' },
        { value: 'empty', label: 'Пусто' },
        { value: 'data', label: 'Данные' },
    ];

    /** Первая студия из подборки «Рекомендуем»; может не найтись — тип Studio | undefined */
    protected get featured(): Studio | undefined {
        return this.studios.find((studio) => studio.featured);
    }

    protected showState(state: DemoState): void {
        this.loading = state === 'loading';
        this.error = state === 'error' ? 'Сервер не ответил' : null;
        this.studios = state === 'data' ? DEMO_STUDIOS : [];
    }

    protected search(query: string): void {
        console.warn('поиск: ', query);
    }
}
