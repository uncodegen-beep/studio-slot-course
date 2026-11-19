import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Subject, debounceTime, distinctUntilChanged, map, of, switchMap } from 'rxjs';

import { StudiosApi } from '@entities/studio/api/studios.api';

import type { Studio } from '@shared/model';

/** Пауза после последнего нажатия, прежде чем искать */
export const SEARCH_DEBOUNCE_MS = 300;
/** Короче — слишком много совпадений, запрос бесполезен */
export const SEARCH_MIN_LENGTH = 2;

/** Поиск студии с подсказками. Каждый ввод — запрос; устаревший запрос отменяется */
@Component({
    selector: 'app-studio-search',
    imports: [RouterLink],
    template: `
        <label class="field">
            Найти студию
            <input
                #input
                type="search"
                placeholder="Название или город"
                (input)="search(input.value)"
            />
        </label>
        @if (results().length) {
            <ul class="results">
                @for (studio of results(); track studio.id) {
                    <li>
                        <a [routerLink]="['/studios', studio.id]">{{ studio.name }}</a>
                        · {{ studio.city }}
                    </li>
                }
            </ul>
        }
    `,
    styleUrl: './studio-search.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudioSearchComponent {
    private readonly api = inject(StudiosApi);
    /** Поток запросов из поля ввода */
    private readonly queries = new Subject<string>();

    protected readonly results = signal<readonly Studio[]>([]);

    constructor() {
        const subscription = this.queries
            .pipe(
                // Пока пользователь печатает — ждём. «s-o-u-n-d» за секунду = один запрос, а не пять
                debounceTime(SEARCH_DEBOUNCE_MS),
                // Одна буква — как пустой запрос: подсказки скрываются
                map((query) => (query.length >= SEARCH_MIN_LENGTH ? query : '')),
                // «sound» → «sounds» → «sound» за время паузы — запрос не повторяем
                distinctUntilChanged(),
                // Новый ввод — switchMap отписывается от прошлого запроса, HttpClient его отменяет.
                // Ответ на «so» не перезапишет ответ на «sound», даже если придёт позже
                switchMap((query) => (query ? this.api.search(query) : of([]))),
            )
            .subscribe((studios) => this.results.set(studios));
        inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
    }

    protected search(query: string): void {
        this.queries.next(query.trim());
    }
}
