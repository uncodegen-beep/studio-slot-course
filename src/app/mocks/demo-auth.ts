import { type HttpHandler, HttpResponse, http } from 'msw';

import { type Session, type UserRole, demoUser } from '@entities/session/model/session.store';

export function createDemoAuth(): {
    routes: HttpHandler[];
    deny: (request: Request, role: UserRole, studioId?: string) => Response | null;
} {
    let active: Session | null = null;
    let expires = 0;
    function issue(role: UserRole): Session {
        active = { user: demoUser(role), accessToken: crypto.randomUUID() };
        expires = Date.now() + 15 * 60_000;
        return active;
    }
    function deny(request: Request, role: UserRole, studioId?: string): Response | null {
        if (
            !active ||
            Date.now() >= expires ||
            request.headers.get('Authorization') !== 'Bearer ' + active.accessToken
        )
            return HttpResponse.json({ message: 'Требуется вход' }, { status: 401 });
        if (active.user.role !== role || (studioId && !active.user.studioIds.includes(studioId)))
            return HttpResponse.json({ message: 'Нет доступа' }, { status: 403 });
        return null;
    }
    const routes = [
        http.post('*/api/auth/demo', async ({ request }) => {
            const { role } = (await request.json()) as { role: unknown };
            if (role !== 'client' && role !== 'owner')
                return HttpResponse.json({ message: 'Неизвестная роль' }, { status: 400 });
            return HttpResponse.json(issue(role));
        }),
        http.post('*/api/auth/logout', () => {
            active = null;
            return new HttpResponse(null, { status: 204 });
        }),
    ];
    return { routes, deny };
}
