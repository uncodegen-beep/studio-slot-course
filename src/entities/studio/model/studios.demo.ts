import type { Studio } from '@shared/model';

/** Демо-данные до появления API (модуль 06) */
export const DEMO_STUDIOS: Studio[] = [
    {
        id: 'sound-garden',
        name: 'Sound Garden',
        city: 'Москва',
        pricePerHour: 1500,
        coverUrl: 'images/studio-placeholder.svg',
        isOpen: true,
        rating: 4.6,
        featured: true,
    },
    {
        id: 'nevsky-beat',
        name: 'Nevsky Beat',
        city: 'Санкт-Петербург',
        pricePerHour: 1200,
        coverUrl: 'images/studio-placeholder.svg',
        isOpen: true,
        rating: 4.2,
        isNew: true,
    },
    {
        id: 'volga-records',
        name: 'Volga Records',
        city: 'Казань',
        pricePerHour: 900,
        coverUrl: 'images/studio-placeholder.svg',
        isOpen: false,
        rating: 3.9,
    },
];
