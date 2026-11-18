import type { SessionUser } from '@entities/session/model/session.store';

import { ownsStudio } from './owner-studio';

const OWNER: SessionUser = { name: 'Владелец', role: 'owner', studioIds: ['sound-garden'] };
const CLIENT: SessionUser = { name: 'Клиент', role: 'client', studioIds: ['sound-garden'] };

describe('ownsStudio', () => {
    it('владелец — только свои студии', () => {
        expect(ownsStudio(OWNER, 'sound-garden')).toBe(true);
        expect(ownsStudio(OWNER, 'volga-records')).toBe(false);
    });

    it('клиент и гость — никогда, даже с таким id в списке', () => {
        expect(ownsStudio(CLIENT, 'sound-garden')).toBe(false);
        expect(ownsStudio(null, 'sound-garden')).toBe(false);
    });
});
