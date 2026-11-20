import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { forkJoin, of } from 'rxjs';

import { SessionStore } from '@entities/session/model/session.store';
import { StudiosApi } from '@entities/studio/api/studios.api';

/** /owner — студии владельца с сервера. Ссылки относительные: studios/:id внутри раздела /owner */
@Component({
    selector: 'app-owner-studios-page',
    imports: [RouterLink],
    template: `
        <h1>Мои студии</h1>
        @if (studios.error()) {
            <p class="error">Не удалось загрузить студии.</p>
            <button
                type="button"
                (click)="studios.reload()"
            >
                Повторить
            </button>
        } @else if (studios.hasValue()) {
            <ul class="studios">
                @for (studio of studios.value(); track studio.id) {
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
    private readonly session = inject(SessionStore);

    /**
     * Данные для экрана — это состояние: загрузка, значение, ошибка. Поэтому resource, а не
     * ручной subscribe с тремя сигналами. RxJS остался внутри — forkJoin для параллельных запросов.
     * params — сигнал: сменится набор студий, и resource загрузит заново
     */
    protected readonly studios = rxResource({
        params: () => this.session.user()?.studioIds ?? [],
        stream: ({ params: ids }) =>
            ids.length ? forkJoin(ids.map((id) => this.api.getById(id))) : of([]),
    });
}
