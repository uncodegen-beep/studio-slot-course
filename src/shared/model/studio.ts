/** Зал студии: у каждого своя цена */
export interface StudioRoom {
    readonly id: string;
    name: string;
    pricePerHour: number;
}

/** Студия звукозаписи в каталоге */
export interface Studio {
    readonly id: string;
    name: string;
    city: string;
    pricePerHour: number;
    /** Обложка: путь от корня сайта или https-ссылка */
    coverUrl: string;
    /** Принимает ли бронирования сейчас */
    isOpen: boolean;
    /** Рейтинг 0–5 */
    rating?: number;
    /** Подборка «Рекомендуем» */
    featured?: boolean;
    /** Появилась в каталоге недавно */
    isNew?: boolean;
    /** Залы; цена студии — минимальная из них */
    rooms?: readonly StudioRoom[];
}

/** Карточка в списке: только то, что показываем */
export type StudioPreview = Pick<Studio, 'id' | 'name' | 'city' | 'pricePerHour'>;

/** Данные для создания: id выдаёт сервер */
export type NewStudio = Omit<Studio, 'id'>;

/** Патч при редактировании: любое подмножество полей */
export type StudioPatch = Partial<NewStudio>;
