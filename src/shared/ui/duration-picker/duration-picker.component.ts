import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

/**
 * Выбор длительности: <app-duration-picker [(value)]="hours" />.
 * model() — вход value и выход valueChange сразу: компонент меняет значение сам и сообщает родителю
 */
@Component({
    selector: 'app-duration-picker',
    template: `
        <div
            class="picker"
            role="group"
            [attr.aria-label]="label()"
        >
            @for (hours of options(); track hours) {
                <button
                    type="button"
                    [attr.aria-pressed]="value() === hours"
                    (click)="value.set(hours)"
                >
                    {{ hours }} ч
                </button>
            }
        </div>
    `,
    styleUrl: './duration-picker.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DurationPickerComponent {
    readonly options = input<readonly number[]>([1, 2, 3, 4]);
    readonly label = input('Длительность');
    readonly value = model(1);
}
