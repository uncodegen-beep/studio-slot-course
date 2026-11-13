import {
    ChangeDetectionStrategy,
    Component,
    InjectionToken,
    forwardRef,
    inject,
    input,
} from '@angular/core';

/** Токен группы: вложенные группы находят по нему родительскую */
export const FIELD_GROUP = new InjectionToken<FieldGroupComponent>('FIELD_GROUP');

/**
 * Группа полей с подписью. Вложенные группы получают отступ по уровню вложенности:
 * <app-field-group legend="Фильтры"> … <app-field-group legend="Цена"> … </app-field-group>
 */
@Component({
    selector: 'app-field-group',
    template: `
        <fieldset class="group">
            <legend>{{ legend() }}</legend>
            <ng-content />
        </fieldset>
    `,
    styleUrl: './field-group.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Группа предоставляет себя детям — и проецированным через ng-content тоже
    providers: [{ provide: FIELD_GROUP, useExisting: forwardRef(() => FieldGroupComponent) }],
    host: {
        '[style.--depth]': 'depth',
        '[attr.data-depth]': 'depth',
    },
})
export class FieldGroupComponent {
    readonly legend = input.required<string>();

    /**
     * skipSelf — поиск с родителя: без него группа нашла бы саму себя (свой провайдер выше).
     * optional — у группы верхнего уровня родителя нет: null вместо ошибки NG0201
     */
    private readonly parent = inject(FIELD_GROUP, { skipSelf: true, optional: true });

    /** Уровень вложенности: 0 — верхняя группа */
    readonly depth: number = (this.parent?.depth ?? -1) + 1;
}
