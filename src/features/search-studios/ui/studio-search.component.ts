import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    linkedSignal,
    signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';

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

import { highlight } from '@shared/lib/text/highlight';
import type { Studio } from '@shared/model';

/** Пауза после последнего нажатия, прежде чем искать */
export const SEARCH_DEBOUNCE_MS = 300;
/** Короче — слишком много совпадений, запрос бесполезен */
export const SEARCH_MIN_LENGTH = 2;
/** Повторы при сбое сети и пауза между ними */
export const SEARCH_RETRIES = 2;
export const SEARCH_RETRY_MS = 1000;

/**
 * Поиск студии в шапке: подсказки, клавиатура и подсветка совпадений.
 * Разметка — паттерн combobox из WAI-ARIA: поле + список вариантов
 */
@Component({
    selector: 'app-studio-search',
    imports: [RouterLink],
    templateUrl: './studio-search.component.html',
    styleUrl: './studio-search.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudioSearchComponent {
    private readonly api = inject(StudiosApi);
    private readonly router = inject(Router);

    protected readonly query = signal('');
    protected readonly failed = signal(false);
    /** Escape прячет подсказки, новый ввод — показывает снова */
    protected readonly dismissed = signal(false);
    protected readonly highlight = highlight;

    protected readonly results = toSignal(
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

    /** Выбранная стрелками подсказка. Новые результаты — выбор сбрасывается (linkedSignal, урок 28) */
    protected readonly active = linkedSignal({ source: this.results, computation: () => -1 });
    protected readonly open = computed(() => !this.dismissed() && this.results().length > 0);
    protected readonly activeId = computed(() => {
        const studio = this.results()[this.active()];
        return this.open() && studio ? this.optionId(studio) : null;
    });

    protected optionId(studio: Studio): string {
        return `studio-option-${studio.id}`;
    }

    protected onInput(value: string): void {
        this.dismissed.set(false);
        this.query.set(value.trim());
    }

    protected onKeydown(event: KeyboardEvent): void {
        const count = this.results().length;
        if (!this.open() || !count) {
            return;
        }
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.active.update((index) => (index + 1) % count);
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.active.update((index) => (index <= 0 ? count - 1 : index - 1));
                break;
            case 'Enter': {
                const studio = this.results()[this.active()];
                if (studio) {
                    event.preventDefault();
                    this.go(studio);
                }
                break;
            }
            case 'Escape':
                this.dismissed.set(true);
                break;
        }
    }

    /** Клик по подсказке: переход делает routerLink, нам — очистить поле */
    protected close(): void {
        this.query.set('');
        this.dismissed.set(true);
    }

    /** Enter на выбранной подсказке: переход из кода (урок 45) */
    private go(studio: Studio): void {
        this.close();
        void this.router.navigate(['/studios', studio.id]);
    }
}
