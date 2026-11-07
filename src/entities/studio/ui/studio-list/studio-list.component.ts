import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, type TemplateRef } from '@angular/core';

import type { Studio } from '@shared/model';

/** Контекст шаблона элемента: $implicit — для let-studio, index — для let-i="index" */
export interface StudioItemContext {
    $implicit: Studio;
    index: number;
}

@Component({
    selector: 'app-studio-list',
    imports: [NgTemplateOutlet],
    templateUrl: './studio-list.component.html',
    styleUrl: './studio-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudioListComponent {
    // Декоратор @Input подробно — в уроке 16, сигнальные input() — в модуле 02
    @Input() studios: Studio[] = [];
    /** Как рисовать элемент; не передан — шаблон по умолчанию */
    @Input() itemTemplate?: TemplateRef<StudioItemContext>;
}
