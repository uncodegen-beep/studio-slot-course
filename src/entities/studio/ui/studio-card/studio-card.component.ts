import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Studio } from '@shared/model';

@Component({
    selector: 'app-studio-card',
    templateUrl: './studio-card.component.html',
    styleUrl: './studio-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudioCardComponent {
    /** Пока данные прямо в компоненте — в уроке 16 придут через @Input */
    protected readonly studio: Studio = {
        id: 'sound-garden',
        name: 'Sound Garden',
        city: 'Москва',
        pricePerHour: 1500,
        coverUrl: 'images/studio-placeholder.svg',
        isOpen: true,
        rating: 4.6,
        featured: true,
        isNew: false,
    };

    protected toggleFavorite(id: string): void {
        console.warn('избранное', id);
    }
}
