import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SessionStore } from '@entities/session/model/session.store';
import { CatalogStore } from '@entities/studio/model/catalog.store';

import { ownsStudio } from '../model/owner-studio';

/** /owner — студии владельца. Ссылки относительные: studios/:id внутри раздела /owner */
@Component({
    selector: 'app-owner-studios-page',
    imports: [RouterLink],
    template: `
        <h1>Мои студии</h1>
        <ul class="studios">
            @for (studio of studios(); track studio.id) {
                <li>
                    <a [routerLink]="['studios', studio.id]">{{ studio.name }}</a>
                    · {{ studio.city }} · залов: {{ studio.rooms?.length ?? 0 }}
                </li>
            } @empty {
                <li>Студий пока нет</li>
            }
        </ul>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerStudiosPageComponent {
    private readonly session = inject(SessionStore);
    private readonly catalog = inject(CatalogStore);

    protected readonly studios = computed(() =>
        this.catalog.studios().filter((studio) => ownsStudio(this.session.user(), studio.id)),
    );
}
