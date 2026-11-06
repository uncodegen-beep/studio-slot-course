/** Студия звукозаписи в каталоге */
export interface Studio {
    readonly id: string;
    name: string;
    city: string;
    pricePerHour: number;
    rating?: number;
}

/** Карточка в списке: только то, что показываем */
export type StudioPreview = Pick<
    Studio,
    "id" | "name" | "city" | "pricePerHour"
>;

/** Данные для создания: id выдаёт сервер */
export type NewStudio = Omit<Studio, "id">;

/** Патч при редактировании: любое подмножество полей */
export type StudioPatch = Partial<NewStudio>;
