import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { StudiosApi } from '@entities/studio/api/studios.api';

import type { Studio } from '@shared/model';
import { SpinnerComponent } from '@shared/ui/spinner/spinner.component';

/** Страница студии: /studios/:id. Данные — через StudiosApi, состояния загрузки встроены в ресурс */
@Component({
    selector: 'app-studio-page',
    imports: [CurrencyPipe, DecimalPipe, RouterLink, SpinnerComponent],
    templateUrl: './studio-page.component.html',
    styleUrl: './studio-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudioPageComponent {
    /** Зависимости — первыми: поля инициализируются сверху вниз, studio ниже использует api */
    private readonly api = inject(StudiosApi);

    /** :id из адреса — вход компонента (withComponentInputBinding в app.config) */
    readonly id = input.required<string>();

    /**
     * Адрес и HttpClient теперь в сервисе. rxResource принимает Observable из метода сервиса:
     * сменился id — новый запрос, незавершённый прошлый отменяется (подробно о RxJS — модуль 05)
     */
    protected readonly studio = rxResource<Studio, string>({
        params: () => this.id(),
        stream: ({ params: id }) => this.api.getById(id),
    });
}
