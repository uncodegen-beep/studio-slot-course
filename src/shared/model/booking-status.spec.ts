// Импорт через алиас @shared/*: проверяем, что paths из tsconfig работают и в тестах
import { type BookingStatus, STATUS_LABELS } from '@shared/model';

describe('STATUS_LABELS', () => {
    it('есть подпись для каждого статуса бронирования', () => {
        const statuses: BookingStatus[] = ['PENDING', 'CONFIRMED', 'CANCELED'];

        for (const status of statuses) {
            expect(STATUS_LABELS[status]).toBeTruthy();
        }
    });

    it('noUncheckedIndexedAccess: элемент массива может отсутствовать', () => {
        const statuses: BookingStatus[] = [];

        const first = statuses[0]; // BookingStatus | undefined

        expect(first ? STATUS_LABELS[first] : 'Нет статуса').toBe('Нет статуса');
    });
});
