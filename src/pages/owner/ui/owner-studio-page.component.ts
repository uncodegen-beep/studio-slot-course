import { CurrencyPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    input,
    linkedSignal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { skip } from 'rxjs';

import { StudiosApi } from '@entities/studio/api/studios.api';

import { autosave } from '@shared/lib/rx/autosave';
import { formatTitle } from '@shared/lib/title/app-title.strategy';
import type { Studio } from '@shared/model';

const STATUS_TEXT = {
    saving: 'Сохраняем…',
    saved: 'Сохранено',
    error: 'Не удалось сохранить. Изменения останутся в поле — попробуйте ещё раз',
} as const;

/** /owner/studios/:slug — своя студия владельца. Данные — от ownerStudioResolver */
@Component({
    selector: 'app-owner-studio-page',
    imports: [CurrencyPipe, RouterLink],
    template: `
        <a routerLink="/owner">← Мои студии</a>

        @let s = studio();
        <h1>{{ s.name }}</h1>
        <p>{{ s.city }} · {{ s.isOpen ? 'принимает бронирования' : 'бронирование закрыто' }}</p>

        <h2>Залы и цены</h2>
        <ul class="rooms">
            @for (room of s.rooms ?? []; track room.id) {
                <li>
                    {{ room.name }} —
                    {{ room.pricePerHour | currency: 'RUB' : 'symbol-narrow' : '1.0-0' }}/час
                </li>
            } @empty {
                <li>Залов пока нет</li>
            }
        </ul>

        <h2>Описание для гостей</h2>
        <label class="description">
            <span>Что важно знать перед бронированием</span>
            <textarea
                #area
                rows="4"
                [value]="description()"
                (input)="description.set(area.value)"
            ></textarea>
        </label>
        <!-- role="status": экранный диктор сообщит «Сохранено», не перебивая ввод -->
        <p
            class="save-status"
            role="status"
        >
            {{ statusText() }}
        </p>
    `,
    styles: `
        .description {
            display: grid;
            gap: 4px;
            max-width: 560px;
        }

        textarea {
            padding: 8px 12px;
            border: 1px solid #c8cedb;
            border-radius: 8px;
            font: inherit;
        }

        .save-status {
            min-height: 1.5em;
            color: #5b6478;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerStudioPageComponent {
    readonly studio = input.required<Studio>();

    private readonly api = inject(StudiosApi);
    private readonly title = inject(Title);

    /** Черновик описания: из данных студии, дальше — то, что печатает владелец */
    protected readonly description = linkedSignal(() => this.studio().description ?? '');

    /** Поле → поток → autosave → статус для шаблона. skip(1): исходное значение не сохраняем */
    private readonly status = toSignal(
        toObservable(this.description).pipe(
            skip(1),
            autosave((text) => this.api.update({ ...this.studio(), description: text })),
        ),
    );
    protected readonly statusText = computed(() => {
        const status = this.status();
        return status ? STATUS_TEXT[status] : '';
    });

    constructor() {
        effect(() => this.title.setTitle(formatTitle(this.studio().name)));
    }
}
