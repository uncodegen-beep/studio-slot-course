import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    map,
    of,
    retry,
    switchMap,
    tap,
} from 'rxjs';

import { StudiosApi } from '@entities/studio/api/studios.api';

/** Пауза после последнего нажатия, прежде чем искать */
export const SEARCH_DEBOUNCE_MS = 300;
/** Короче — слишком много совпадений, запрос бесполезен */
export const SEARCH_MIN_LENGTH = 2;
/** Повторы при сбое сети и пауза между ними */
export const SEARCH_RETRIES = 2;
export const SEARCH_RETRY_MS = 1000;

/** Поиск студии с подсказками. Сигнал → поток → сигнал: время и отмена — в RxJS, шаблон — на сигналах */
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
                [value]="query()"
                (input)="query.set(input.value.trim())"
            />
        </label>
        @if (failed()) {
            <p
                class="error"
                role="alert"
            >
                Поиск сейчас недоступен. Попробуйте ещё раз чуть позже.
            </p>
        } @else if (results().length) {
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

    /** Текст поиска — состояние, поэтому сигнал. Subject из урока 61 больше не нужен */
    protected readonly query = signal('');
    protected readonly failed = signal(false);

    /** toSignal: результаты для шаблона без async pipe; отписка — при уничтожении компонента */
    protected readonly results = toSignal(
        // toObservable: каждое новое значение сигнала — значение потока
        toObservable(this.query).pipe(
            debounceTime(SEARCH_DEBOUNCE_MS),
            map((query) => (query.length >= SEARCH_MIN_LENGTH ? query : '')),
            distinctUntilChanged(),
            tap(() => this.failed.set(false)),
            switchMap((query) =>
                query
                    ? this.api.search(query).pipe(
                          retry({ count: SEARCH_RETRIES, delay: SEARCH_RETRY_MS }),
                          catchError(() => {
                              this.failed.set(true);
                              return of([]);
                          }),
                      )
                    : of([]),
            ),
        ),
        { initialValue: [] },
    );
}
