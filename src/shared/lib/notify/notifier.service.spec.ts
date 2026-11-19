import { TestBed } from '@angular/core/testing';

import { BehaviorSubject, ReplaySubject } from 'rxjs';

import { type Notice, NotifierService } from './notifier.service';

describe('NotifierService', () => {
    it('Subject: подписчик получает только события после подписки', () => {
        const notifier = TestBed.inject(NotifierService);
        const received: Notice[] = [];

        notifier.notify('до подписки');
        const subscription = notifier.notices$.subscribe((notice) => received.push(notice));
        notifier.notify('после подписки');
        subscription.unsubscribe();

        expect(received).toEqual([{ text: 'после подписки' }]);
    });

    it('notices$ — только чтение: next снаружи недоступен', () => {
        const notices$ = TestBed.inject(NotifierService).notices$;

        expect('next' in notices$).toBe(false);
    });

    it('для сравнения: BehaviorSubject и ReplaySubject помнят прошлое', () => {
        const current = new BehaviorSubject('начальное');
        const lastTwo = new ReplaySubject<string>(2);
        ['a', 'b', 'c'].forEach((value) => lastTwo.next(value));
        const seen: string[] = [];

        current.subscribe((value) => seen.push(value)).unsubscribe();
        lastTwo.subscribe((value) => seen.push(value)).unsubscribe();

        expect(current.value).toBe('начальное');
        expect(seen).toEqual(['начальное', 'b', 'c']);
    });
});
