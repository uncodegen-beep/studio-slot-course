import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SessionStore } from '@entities/session/model/session.store';

/** Кабинет владельца: /owner. Пускает только roleGuard('owner'). Наполнение — урок 52 */
@Component({
    selector: 'app-owner-page',
    template: `
        <h1>Кабинет владельца</h1>
        <p>{{ session.user()?.name }}: здесь появятся залы, расписание и цены.</p>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerPageComponent {
    protected readonly session = inject(SessionStore);
}
