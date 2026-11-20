import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    type TestRequest,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DEMO_STUDIOS } from '@entities/studio/model/studios.demo';

import {
    SEARCH_DEBOUNCE_MS,
    SEARCH_RETRIES,
    SEARCH_RETRY_MS,
    StudioSearchComponent,
} from './studio-search.component';

interface Setup {
    readonly root: HTMLElement;
    readonly type: (value: string) => void;
    readonly request: (q: string) => TestRequest;
    readonly render: () => void;
}

function setup(): Setup {
    TestBed.configureTestingModule({
        providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    const fixture = TestBed.createComponent(StudioSearchComponent);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const input = root.querySelector('input') as HTMLInputElement;
    const http = TestBed.inject(HttpTestingController);
    return {
        root,
        // Ввод и пауза debounce: запрос уходит после неё
        type: (value) => {
            input.value = value;
            input.dispatchEvent(new Event('input'));
            // toObservable отдаёт новое значение сигнала через эффект — даём эффектам выполниться
            TestBed.tick();
            vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
        },
        request: (q) =>
            http.expectOne(
                (req) => req.url === 'api/studios/index.json' && req.params.get('q') === q,
            ),
        render: () => fixture.detectChanges(),
    };
}

describe('StudioSearchComponent', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('показывает найденные студии со ссылками', () => {
        const { root, type, request, render } = setup();

        type('nevsky');
        request('nevsky').flush(DEMO_STUDIOS);
        render();

        expect(root.querySelector('.results a')?.getAttribute('href')).toBe('/studios/nevsky-beat');
    });

    it('switchMap: новый ввод отменяет прошлый запрос', () => {
        const { root, type, request, render } = setup();

        type('so');
        const first = request('so');
        type('sound');
        const second = request('sound');

        expect(first.cancelled).toBe(true);
        second.flush(DEMO_STUDIOS);
        render();
        expect([...root.querySelectorAll('.results a')].map((a) => a.textContent)).toEqual([
            'Sound Garden',
        ]);
    });

    it('пустое поле — список очищается без запроса', () => {
        const { root, type, request, render } = setup();

        type('volga');
        request('volga').flush(DEMO_STUDIOS);
        type('   ');
        render();

        TestBed.inject(HttpTestingController).expectNone(() => true);
        expect(root.querySelector('.results')).toBeNull();
    });

    it('debounceTime: быстрый набор — один запрос с последним значением', () => {
        const { root } = setup();
        const input = root.querySelector('input') as HTMLInputElement;
        const http = TestBed.inject(HttpTestingController);

        for (const value of ['s', 'so', 'sou', 'soun', 'sound']) {
            input.value = value;
            input.dispatchEvent(new Event('input'));
            TestBed.tick();
            vi.advanceTimersByTime(100);
        }
        http.expectNone(() => true);

        vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
        expect(http.match(() => true).map((req) => req.request.params.get('q'))).toEqual(['sound']);
    });

    it('distinctUntilChanged: то же значение после паузы — без повторного запроса', () => {
        const { type, request } = setup();

        type('sound');
        request('sound').flush(DEMO_STUDIOS);
        type('sound ');

        TestBed.inject(HttpTestingController).expectNone(() => true);
    });

    it('одна буква — без запроса', () => {
        const { type } = setup();

        type('s');

        TestBed.inject(HttpTestingController).expectNone(() => true);
    });

    describe('ошибки', () => {
        const fail = { status: 500, statusText: 'Server Error' };

        it('retry: сбой и успешный повтор — пользователь ошибки не видит', () => {
            const { root, type, request, render } = setup();

            type('sound');
            request('sound').flush('Server error', fail);
            vi.advanceTimersByTime(SEARCH_RETRY_MS);
            request('sound').flush(DEMO_STUDIOS);
            render();

            expect(root.querySelector('.error')).toBeNull();
            expect(root.querySelector('.results a')?.textContent).toBe('Sound Garden');
        });

        it('catchError: все попытки упали — сообщение, а поиск продолжает работать', () => {
            const { root, type, request, render } = setup();

            type('sound');
            for (let attempt = 0; attempt <= SEARCH_RETRIES; attempt++) {
                request('sound').flush('Server error', fail);
                vi.advanceTimersByTime(SEARCH_RETRY_MS);
            }
            render();
            expect(root.querySelector('[role="alert"]')?.textContent).toContain('недоступен');

            type('volga');
            request('volga').flush(DEMO_STUDIOS);
            render();
            expect(root.querySelector('.error')).toBeNull();
            expect(root.querySelector('.results a')?.textContent).toBe('Volga Records');
        });
    });

    it('toSignal: уничтожение компонента отменяет запрос в полёте', () => {
        const { type, request } = setup();

        type('sound');
        const pending = request('sound');
        TestBed.resetTestingModule();

        expect(pending.cancelled).toBe(true);
    });
});
