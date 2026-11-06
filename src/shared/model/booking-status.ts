/* Union строк вместо enum: меньше кода в бандле, тот же контроль компилятора*/
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELED';

/**
 * satisfies проверяет, что перечислены все статусы, и при этом сохраняет точные
 * типы значений: STATUS_LABELS.PENDING — это "Ожидает", а не просто string
 */
export const STATUS_LABELS = {
    PENDING: 'Ожидает',
    CONFIRMED: 'Подтверждаю',
    CANCELED: 'Отменено',
} satisfies Record<BookingStatus, string>;
