import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TooltipDirective } from '@shared/ui/tooltip/tooltip.directive';

/**
 * Кнопка-иконка: <button app-icon-button label="В избранное"><app-icon name="heart" /></button>.
 * Подсказку даёт TooltipDirective — встроена через hostDirectives, без наследования
 */
@Component({
    selector: 'button[app-icon-button]',
    template: '<ng-content />',
    styleUrl: './icon-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [
        // Вход директивы appTooltip снаружи называется label — детали реализации скрыты
        { directive: TooltipDirective, inputs: ['appTooltip: label'] },
    ],
    host: {
        '[attr.aria-label]': 'label',
    },
})
export class IconButtonComponent {
    /** Встроенная директива доступна через inject — подпись для скринридера та же, что в подсказке */
    private readonly tooltip = inject(TooltipDirective);

    protected get label(): string {
        return this.tooltip.text;
    }
}
