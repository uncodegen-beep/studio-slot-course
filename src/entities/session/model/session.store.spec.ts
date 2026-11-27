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

    it('токен остаётся в памяти и очищается при выходе', () => {
        const session = TestBed.inject(SessionStore);
        session.signIn('owner');
        expect(session.accessToken()).toBeTruthy();
        expect(localStorage.getItem('studioslot.session')).toBeNull();
        session.signOut();
        expect(session.accessToken()).toBeNull();
    });
    it('битые данные в хранилище — не вошёл', () => {
        localStorage.setItem('studioslot.session', '{"role":"admin"}');

        expect(TestBed.inject(SessionStore).isSignedIn()).toBe(false);
    });
});
