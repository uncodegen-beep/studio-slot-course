import { TestBed } from '@angular/core/testing';

import { SessionStore } from './session.store';

describe('SessionStore', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('по умолчанию никто не вошёл', () => {
        const session = TestBed.inject(SessionStore);

        expect(session.isSignedIn()).toBe(false);
        expect(session.role()).toBeNull();
    });

    it('signIn и signOut сохраняются в localStorage', () => {
        const session = TestBed.inject(SessionStore);

        session.signIn('owner');
        TestBed.tick();
        expect(JSON.parse(localStorage.getItem('studioslot.session') ?? 'null')).toEqual({
            name: 'Владелец студии',
            role: 'owner',
        });

        session.signOut();
        TestBed.tick();
        expect(localStorage.getItem('studioslot.session')).toBeNull();
    });

    it('битые данные в хранилище — не вошёл', () => {
        localStorage.setItem('studioslot.session', '{"role":"admin"}');

        expect(TestBed.inject(SessionStore).isSignedIn()).toBe(false);
    });
});
