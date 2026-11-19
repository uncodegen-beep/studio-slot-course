import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { forkJoin, of } from 'rxjs';

import { SessionStore } from '@entities/session/model/session.store';
import { StudiosApi } from '@entities/studio/api/studios.api';

import type { Studio } from '@shared/model';

/** /owner — студии владельца с сервера. Ссылки относительные: studios/:id внутри раздела /owner */
@Component({
    selector: 'app-owner-studios-page',
    imports: [RouterLink],
    template: `
        <h1>Мои студии</h1>
        @if (failed()) {
            <p class="error">Не удалось загрузить студии. Обновите страницу.</p>
        } @else if (studios(); as list) {
            <ul class="studios">
                @for (studio of list; track studio.id) {
                    <li>
                        <a [routerLink]="['studios', studio.id]">{{ studio.name }}</a>
                        · {{ studio.city }} · залов: {{ studio.rooms?.length ?? 0 }}
                    </li>
                } @empty {
                    <li>Студий пока нет</li>
                }
            </ul>
        } @else {
            <p class="loading">Загружаем студии…</p>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerStudiosPageComponent {
    private readonly api = inject(StudiosApi);

    /** null — ещё грузим */
    protected readonly studios = signal<readonly Studio[] | null>(null);
    protected readonly failed = signal(false);

    constructor() {
        const ids = inject(SessionStore).user()?.studioIds ?? [];
        // forkJoin: все запросы параллельно, один ответ — массив в том же порядке, что ids.
        // Пустой массив forkJoin завершает без значения — поэтому of([])
        const studios$ = ids.length ? forkJoin(ids.map((id) => this.api.getById(id))) : of([]);
        // Ушли со страницы до ответа — takeUntilDestroyed отпишется, HttpClient отменит запросы
        studios$.pipe(takeUntilDestroyed()).subscribe({
            next: (studios) => this.studios.set(studios),
            // Хотя бы один запрос упал — forkJoin падает целиком
            error: () => this.failed.set(true),
        });
    }
}
