import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import type { Studio } from '@shared/model';
import { IconButtonComponent } from '@shared/ui/icon-button/icon-button.component';
import { IconComponent } from '@shared/ui/icon/icon.component';

/**
 * Презентационный компонент: данные — только через входы, о действиях сообщает через выходы.
 * Что делать по клику, решает родитель
 */
@Component({
    selector: 'app-studio-card',
    imports: [CurrencyPipe, DecimalPipe, IconComponent, IconButtonComponent],
    templateUrl: './studio-card.component.html',
    styleUrl: './studio-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.closed]': '!studio.isOpen',
        '[class.featured]': 'studio.featured',
        '[class.new]': 'studio.isNew',
    },
})
export class StudioCardComponent {
    /** required: Angular не скомпилирует шаблон, где [studio] не передан */
    @Input({ required: true }) studio!: Studio;
    @Input() favorite = false;

    /** Сообщаем родителю id студии — что сделать с избранным, решает он */
    @Output() favoriteToggle = new EventEmitter<string>();

    protected toggleFavorite(): void {
        this.favoriteToggle.emit(this.studio.id);
    }
}
