import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, type TemplateRef, input } from '@angular/core';

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
    /** Входы-сигналы: в шаблоне читаются вызовом — studios() */
    readonly studios = input<Studio[]>([]);

    /** Как рисовать элемент; не передан — шаблон по умолчанию */
    readonly itemTemplate = input<TemplateRef<StudioItemContext>>();
}
