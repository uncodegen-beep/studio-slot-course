import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Иконки из public/icons/sprite.svg: новая иконка — новый <symbol> и имя здесь */
export type IconName = 'heart' | 'heart-filled';

/**
 * SVG-иконка из спрайта. Декоративная: подпись даёт кнопка или текст рядом (aria-label).
 * Сигнальные input() вместо @Input — в модуле 02
 */
@Component({
    selector: 'app-icon',
    templateUrl: './icon.component.html',
    styleUrl: './icon.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
    /** required: шаблон без [name] не скомпилируется */
    @Input({ required: true }) name!: IconName;
    @Input() size = 20;

    /** Путь без «/» в начале — работает и с base href GitHub Pages */
    protected get href(): string {
        return `icons/sprite.svg#${this.name}`;
    }
}
