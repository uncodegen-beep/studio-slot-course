import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { formatTitle } from '@shared/lib/title/app-title.strategy';
import type { Studio } from '@shared/model';

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
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerStudioPageComponent {
    readonly studio = input.required<Studio>();

    private readonly title = inject(Title);

    constructor() {
        effect(() => this.title.setTitle(formatTitle(this.studio().name)));
    }
}
