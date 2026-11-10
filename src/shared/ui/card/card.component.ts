import { ChangeDetectionStrategy, Component, computed, contentChild } from '@angular/core';

import { CardActionsDirective } from './card-actions.directive';

/**
 * [cardMedia] — обложка, [cardTitle] — заголовок, без атрибута — содержимое, [cardActions] — кнопки
 */
@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
    /** Запрос к спроецированному контенту: сигнал обновится, если кнопки появятся или исчезнут */
    private readonly actions = contentChild(CardActionsDirective);

    protected readonly hasActions = computed(() => this.actions() !== undefined);
}
