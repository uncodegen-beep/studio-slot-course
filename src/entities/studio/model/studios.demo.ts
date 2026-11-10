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
        rooms: [
            { id: 'sound-garden-a', name: 'Зал A — вокал', pricePerHour: 1500 },
            { id: 'sound-garden-b', name: 'Зал B — группа', pricePerHour: 2200 },
            { id: 'sound-garden-c', name: 'Зал C — сведение', pricePerHour: 1800 },
        ],
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
        rooms: [
            { id: 'nevsky-beat-main', name: 'Основной зал', pricePerHour: 1200 },
            { id: 'nevsky-beat-small', name: 'Малый зал', pricePerHour: 1400 },
        ],
    },
    {
        id: 'volga-records',
        name: 'Volga Records',
        city: 'Казань',
        pricePerHour: 900,
        coverUrl: 'images/studio-placeholder.svg',
        isOpen: false,
        rating: 3.9,
        rooms: [{ id: 'volga-records-1', name: 'Зал 1', pricePerHour: 900 }],
    },
];
