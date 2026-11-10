import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Иконки из public/icons/sprite.svg: новая иконка — новый <symbol> и имя здесь */
export type IconName = 'heart' | 'heart-filled';

/**
 * SVG-иконка из спрайта. Декоративная: подпись даёт кнопка или текст рядом (aria-label)
 */
@Component({
    selector: 'app-icon',
    templateUrl: './icon.component.html',
    styleUrl: './icon.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
    /** required: шаблон без [name] не скомпилируется */
    readonly name = input.required<IconName>();
    readonly size = input(20);

    /** Путь без «/» в начале — работает и с base href GitHub Pages */
    protected readonly href = computed(() => `icons/sprite.svg#${this.name()}`);
}
