import { CurrencyPipe, DecimalPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Output,
    booleanAttribute,
    computed,
    input,
} from '@angular/core';

import type { Studio } from '@shared/model';
import { CardComponent } from '@shared/ui/card/card.component';
import { IconButtonComponent } from '@shared/ui/icon-button/icon-button.component';
import { IconComponent } from '@shared/ui/icon/icon.component';

/**
 * Презентационный компонент: данные — только через входы, о действиях сообщает через выходы.
 * Что делать по клику, решает родитель
 */
@Component({
    selector: 'app-studio-card',
    imports: [CardComponent, CurrencyPipe, DecimalPipe, IconButtonComponent, IconComponent],
    templateUrl: './studio-card.component.html',
    styleUrl: './studio-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    /** Привязки к самому тегу компонента: видно рядом с логикой, стили — через :host(.класс) */
    host: {
        '[class.closed]': '!studio().isOpen',
        '[class.featured]': 'studio().featured',
        '[class.new]': 'studio().isNew',
        '[class.compact]': 'compact()',
    },
})
export class StudioCardComponent {
    /** required: шаблон без [studio] не скомпилируется; нет «!» и undefined до инициализации */
    readonly studio = input.required<Studio>();
    readonly favorite = input(false);

    /** <app-studio-card compact /> — атрибут без значения превращается в true */
    readonly compact = input(false, { transform: booleanAttribute });

    /** Сообщаем родителю id студии — что сделать с избранным, решает он */
    @Output() favoriteToggle = new EventEmitter<string>();

    /** Ширина полосы рейтинга в процентах: 5 звёзд — 100 %. computed вместо ngOnChanges */
    protected readonly ratingPercent = computed(() => (this.studio().rating ?? 0) * 20);

    /** Подпись кнопки избранного меняется вместе с состоянием — выражение из шаблона ушло в computed */
    protected readonly favoriteLabel = computed(() =>
        this.favorite()
            ? `Убрать ${this.studio().name} из избранного`
            : `Добавить ${this.studio().name} в избранное`,
    );

    protected toggleFavorite(): void {
        this.favoriteToggle.emit(this.studio().id);
    }
}
