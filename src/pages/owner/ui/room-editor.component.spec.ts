import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DEMO_STUDIOS } from '@entities/studio/model/studios.demo';

import { RoomEditorComponent } from './room-editor.component';

describe('RoomEditorComponent', () => {
    it('показывает ошибку цены и сохраняет после исправления', () => {
        TestBed.configureTestingModule({
            providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
        });
        const fixture = TestBed.createComponent(RoomEditorComponent);
        fixture.componentRef.setInput('studio', DEMO_STUDIOS[0]);
        fixture.detectChanges();
        const root = fixture.nativeElement as HTMLElement;
        const price = root.querySelector<HTMLInputElement>('input[type=number]')!;
        const form = root.querySelector('form')!;
        const http = TestBed.inject(HttpTestingController);
        const save = (value: string): void => {
            price.value = value;
            price.dispatchEvent(new Event('input'));
            form.dispatchEvent(new Event('submit', { cancelable: true }));
            fixture.detectChanges();
        };
        save('0');
        expect(root.textContent).toContain('Введите цену от 1 рубля');
        http.expectNone('api/studios/sound-garden');
        save('900');
        const req = http.expectOne('api/studios/sound-garden');
        expect(req.request.method).toBe('PUT');
        expect(req.request.body.price_per_hour).toBe(900);
        req.flush(req.request.body);
        fixture.detectChanges();
        expect(root.textContent).toContain('Тарифы сохранены');
    });
});
