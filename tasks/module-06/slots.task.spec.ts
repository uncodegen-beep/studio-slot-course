import { slotsSchema } from '../../src/entities/studio/api/room-slots';

describe('Контракт расписания', () => {
    it('принимает часы и пустое расписание', () => {
        expect(slotsSchema.parse([10, 12])).toEqual([10, 12]);
        expect(slotsSchema.parse([])).toEqual([]);
    });
    it.each([[-1], [24], [10.5], ['10']])('отклоняет недопустимый час %s', (hour) => {
        expect(slotsSchema.safeParse([hour]).success).toBe(false);
    });
});
