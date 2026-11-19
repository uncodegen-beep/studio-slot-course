import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
    type Observable,
    Subject,
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

import type { Studio } from '@shared/model';

/** Пауза после последнего нажатия, прежде чем искать */
export const SEARCH_DEBOUNCE_MS = 300;
/** Короче — слишком много совпадений, запрос бесполезен */
export const SEARCH_MIN_LENGTH = 2;
/** Повторы при сбое сети и пауза между ними */
export const SEARCH_RETRIES = 2;
export const SEARCH_RETRY_MS = 1000;

/** Поиск студии с подсказками. Каждый ввод — запрос; устаревший запрос отменяется */
@Component({
    selector: 'app-studio-search',
    imports: [AsyncPipe, RouterLink],
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
        <!-- async подписывается при показе и отписывается при уничтожении компонента -->
        @let results = (results$ | async) ?? [];
        @if (failed()) {
            <p
                class="error"
                role="alert"
            >
                Поиск сейчас недоступен. Попробуйте ещё раз чуть позже.
            </p>
        } @else if (results.length) {
            <ul class="results">
                @for (studio of results; track studio.id) {
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

    protected readonly failed = signal(false);

    /** Подписки в коде нет: на поток подписывается шаблон через async pipe */
    protected readonly results$: Observable<readonly Studio[]> = this.queries.pipe(
        // Пока пользователь печатает — ждём. «s-o-u-n-d» за секунду = один запрос, а не пять
        debounceTime(SEARCH_DEBOUNCE_MS),
        // Одна буква — как пустой запрос: подсказки скрываются
        map((query) => (query.length >= SEARCH_MIN_LENGTH ? query : '')),
        // «sound» → «sounds» → «sound» за время паузы — запрос не повторяем
        distinctUntilChanged(),
        // Новый запрос — старая ошибка больше не актуальна
        tap(() => this.failed.set(false)),
        // Новый ввод — switchMap отписывается от прошлого запроса, HttpClient его отменяет.
        // Ответ на «so» не перезапишет ответ на «sound», даже если придёт позже
        switchMap((query) =>
            query
                ? this.api.search(query).pipe(
                      // Сбой сети — ещё две попытки с паузой, потом сдаёмся
                      retry({ count: SEARCH_RETRIES, delay: SEARCH_RETRY_MS }),
                      // catchError ВНУТРИ switchMap: ошибка гасит только этот запрос.
                      // Снаружи она завершила бы весь поток, и поиск перестал бы работать
                      catchError(() => {
                          this.failed.set(true);
                          return of([]);
                      }),
                  )
                : of([]),
        ),
    );

    protected search(query: string): void {
        this.queries.next(query.trim());
    }
}
