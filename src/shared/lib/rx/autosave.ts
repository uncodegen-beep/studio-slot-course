/** Что показать пользователю рядом с полем: «Сохраняем…», «Сохранено», «Не удалось сохранить» */
export type AutosaveStatus = 'saving' | 'saved' | 'error';

export interface AutosaveOptions<T> {
    /** Пауза после последнего изменения, прежде чем сохранять. По умолчанию 1000 мс */
    readonly debounceMs?: number;
    /** Как сравнивать значения, чтобы не сохранять то же самое дважды. По умолчанию Object.is */
    readonly isEqual?: (previous: T, current: T) => boolean;
}

// Задание модуля 05 (tasks/module-05): допишите здесь оператор autosave
