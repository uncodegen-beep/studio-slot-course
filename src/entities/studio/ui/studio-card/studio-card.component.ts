import { CurrencyPipe, DecimalPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    type OnChanges,
    Output,
    type SimpleChanges,
    booleanAttribute,
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
        '[class.closed]': '!studio.isOpen',
        '[class.featured]': 'studio.featured',
        '[class.new]': 'studio.isNew',
        '[class.compact]': 'compact',
    },
})
export class StudioCardComponent implements OnChanges {
    /** required: Angular не скомпилирует шаблон, где [studio] не передан */
    @Input({ required: true }) studio!: Studio;
    @Input() favorite = false;
    /** <app-studio-card compact /> — атрибут без значения превращается в true */
    @Input({ transform: booleanAttribute }) compact = false;

    /** Сообщаем родителю id студии — что сделать с избранным, решает он */
    @Output() favoriteToggle = new EventEmitter<string>();

    /** Ширина полосы рейтинга в процентах: 5 звёзд — 100 % */
    protected ratingPercent = 0;

    // В конструкторе входов ещё нет: this.studio — undefined. Первый раз они приходят в ngOnChanges
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['studio']) {
            // rating необязательный, а строгий TS не даёт умножать undefined
            this.ratingPercent = (this.studio.rating ?? 0) * 20;
        }
    }

    protected toggleFavorite(): void {
        this.favoriteToggle.emit(this.studio.id);
    }
}
