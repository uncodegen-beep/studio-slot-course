import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Универсальная карточка: разметку слотов задаёт тот, кто её использует.
 * [cardTitle] — заголовок, без атрибута — содержимое, [cardActions] — кнопки
 */
@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {}
