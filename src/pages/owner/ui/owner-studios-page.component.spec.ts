import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { StudiosApi } from '@entities/studio/api/studios.api';
import { DEMO_STUDIOS } from '@entities/studio/model/studios.demo';

import type { Studio } from '@shared/model';

import { OwnerStudioPageComponent } from './owner-studio-page.component';

const [SOUND_GARDEN] = DEMO_STUDIOS as [Studio, ...Studio[]];

describe('OwnerStudioPageComponent', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient()] });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    function setup(): { root: HTMLElement; type: (text: string) => void; render: () => void } {
        const fixture = TestBed.createComponent(OwnerStudioPageComponent);
        fixture.componentRef.setInput('studio', { ...SOUND_GARDEN, description: 'Есть парковка' });
        fixture.detectChanges();
        const root = fixture.nativeElement as HTMLElement;
        const area = root.querySelector('textarea') as HTMLTextAreaElement;
        return {
            root,
            type: (text) => {
                area.value = text;
                area.dispatchEvent(new Event('input'));
                // toObservable передаёт значение сигнала через эффект
                TestBed.tick();
            },
            render: () => fixture.detectChanges(),
        };
    }

    const status = (root: HTMLElement): string | undefined =>
        root.querySelector('[role="status"]')?.textContent?.trim();

    it('черновик берётся из данных студии, заголовок вкладки — её имя', () => {
        const { root } = setup();

        expect(root.querySelector('textarea')?.value).toBe('Есть парковка');
        expect(TestBed.inject(Title).getTitle()).toBe('Sound Garden — StudioSlot');
    });

    it('autosave: пауза — «Сохраняем…», ответ — «Сохранено», один запрос на серию правок', () => {
        const save = vi.spyOn(TestBed.inject(StudiosApi), 'updateDescription');
        const { root, type, render } = setup();

        type('Есть парковка и');
        vi.advanceTimersByTime(300);
        type('Есть парковка и кофе');
        vi.advanceTimersByTime(1000);
        render();
        expect(status(root)).toBe('Сохраняем…');

        vi.advanceTimersByTime(400);
        render();
        expect(status(root)).toBe('Сохранено');
        expect(save).toHaveBeenCalledExactlyOnceWith('sound-garden', 'Есть парковка и кофе');
    });

    it('открыли страницу и ничего не меняли — сохранения нет', () => {
        const save = vi.spyOn(TestBed.inject(StudiosApi), 'updateDescription');
        const { root, render } = setup();

        vi.advanceTimersByTime(5000);
        render();

        expect(save).not.toHaveBeenCalled();
        expect(status(root)).toBe('');
    });
});
