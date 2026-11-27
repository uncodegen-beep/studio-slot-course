import { httpResource } from '@angular/common/http';
import { Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { studioDtoSchema } from '@entities/studio/api/studio.dto';

import { requestErrorMessage } from '@shared/api/request-error';

@Component({
    selector: 'app-nearby-studios',
    imports: [RouterLink],
    template: ` <button
            type="button"
            (click)="opened.set(true)"
        >
            Другие студии в этом городе
        </button>
        @if (studios.isLoading()) {
            <p role="status">Загружаем студии…</p>
        } @else if (studios.error()) {
            <p>{{ message(studios.error()) }}</p>
            <button (click)="studios.reload()">Повторить</button>
        } @else if (studios.hasValue()) {
            <ul>
                @for (studio of others(); track studio.id) {
                    <li>
                        <a [routerLink]="['/studios', studio.id]">{{ studio.name }}</a>
                    </li>
                } @empty {
                    <li>Других студий пока нет</li>
                }
            </ul>
        }`,
})
export class NearbyStudiosComponent {
    readonly city = input.required<string>();
    readonly studioId = input.required<string>();
    protected readonly opened = signal(false);
    protected readonly message = requestErrorMessage;
    protected readonly studios = httpResource(
        () =>
            this.opened()
                ? { url: 'api/studios', params: { city: this.city(), q: '' } }
                : undefined,
        { parse: (body) => studioDtoSchema.array().parse(body) },
    );
    protected readonly others = computed(
        () => this.studios.value()?.filter((studio) => studio.id !== this.studioId()) ?? [],
    );
}
