import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { Studio } from '@shared/model';
import { SpinnerComponent } from '@shared/ui/spinner/spinner.component';

/** Страница студии: /studios/:id. Данные — httpResource, состояния загрузки встроены */
@Component({
    selector: 'app-studio-page',
    imports: [CurrencyPipe, DecimalPipe, RouterLink, SpinnerComponent],
    templateUrl: './studio-page.component.html',
    styleUrl: './studio-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudioPageComponent {
    /** :id из адреса — вход компонента (withComponentInputBinding в app.config) */
    readonly id = input.required<string>();

    /**
     * Функция реактивна: сменился id — новый запрос, а незавершённый прошлый отменяется.
     * Пока API нет, это JSON-заглушка из public/api — путь без «/» в начале ради GitHub Pages
     */
    protected readonly studio = httpResource<Studio>(() => `api/studios/${this.id()}.json`);
}
