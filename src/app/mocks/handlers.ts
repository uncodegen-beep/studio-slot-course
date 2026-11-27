import { type HttpHandler, HttpResponse, delay, http } from 'msw';

import { type StudioDto, toStudio, toStudioDto } from '@entities/studio/api/studio.dto';

import { type MockDb, type NewBookingBody, createDb } from './db';
/**
 * Обработчики мок-API. «*» в начале пути — любой адрес сайта:
 * на GitHub Pages приложение живёт не в корне домена, а в /studio-slot-course/
 */
import { createDemoAuth } from './demo-auth';

/** Ошибка в одном формате для всего API: { statusCode, error, message } */
function notFound(
    message: string,
): HttpResponse<{ statusCode: number; error: string; message: string }> {
    return HttpResponse.json({ statusCode: 404, error: 'Not Found', message }, { status: 404 });
}

export function createHandlers(db: MockDb = createDb()): HttpHandler[] {
    const auth = createDemoAuth();
    return [
        ...auth.routes,
        http.get('*/api/studios', async ({ request }) => {
            // delay() без аргумента — случайная «сетевая» задержка, как у настоящего сервера
            await delay();
            const params = new URL(request.url).searchParams;
            return HttpResponse.json(
                db.searchStudios(params.get('q') ?? '', params.get('city') ?? '').map(toStudioDto),
            );
        }),

        http.get('*/api/studios/:id', async ({ params }) => {
            await delay();
            const studio = db.getStudio(String(params['id']));
            return studio ? HttpResponse.json(toStudioDto(studio)) : notFound('Студия не найдена');
        }),

        // PUT — замена ресурса целиком: клиент присылает студию полностью
        http.put('*/api/studios/:id', async ({ params, request }) => {
            await delay();
            const denied = auth.deny(request, 'owner', String(params['id']));
            if (denied) return denied;
            const saved = db.replaceStudio(
                String(params['id']),
                toStudio((await request.json()) as StudioDto),
            );
            return saved ? HttpResponse.json(toStudioDto(saved)) : notFound('Студия не найдена');
        }),

        http.get('*/api/bookings', async ({ request }) => {
            await delay();
            const denied = auth.deny(request, 'client');
            if (denied) return denied;
            return HttpResponse.json(db.listBookings());
        }),

        // POST — создание: 201 Created и созданная бронь с id от сервера
        http.post('*/api/bookings', async ({ request }) => {
            await delay();
            const denied = auth.deny(request, 'client');
            if (denied) return denied;
            const booking = db.createBooking((await request.json()) as NewBookingBody);
            return HttpResponse.json(booking, { status: 201 });
        }),

        // DELETE — 204 No Content: удалили, вернуть нечего
        http.delete('*/api/bookings/:id', async ({ params, request }) => {
            await delay();
            const denied = auth.deny(request, 'client');
            if (denied) return denied;
            return db.deleteBooking(String(params['id']))
                ? new HttpResponse(null, { status: 204 })
                : notFound('Бронь не найдена');
        }),
    ];
}
