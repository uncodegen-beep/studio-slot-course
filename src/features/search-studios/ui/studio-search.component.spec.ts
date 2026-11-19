import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    type TestRequest,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DEMO_STUDIOS } from '@entities/studio/model/studios.demo';

import { StudioSearchComponent } from './studio-search.component';

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
        type: (value) => {
            input.value = value;
            input.dispatchEvent(new Event('input'));
        },
        request: (q) =>
            http.expectOne(
                (req) => req.url === 'api/studios/index.json' && req.params.get('q') === q,
            ),
        render: () => fixture.detectChanges(),
    };
}

describe('StudioSearchComponent', () => {
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
});
