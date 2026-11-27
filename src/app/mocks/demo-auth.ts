import { type HttpHandler, HttpResponse, http } from 'msw';

import { type Session, type UserRole, demoUser } from '@entities/session/model/session.store';

export function createDemoAuth(): {
    routes: HttpHandler[];
    deny: (request: Request, role: UserRole, studioId?: string) => Response | null;
} {
    let active: Session | null = null;
    let expires = 0;
    // Только для MSW: имитация серверной refresh-сессии в пределах вкладки.
    const key = 'studioslot.mock.refresh';
    function remember(role: UserRole): void {
        sessionStorage.setItem(key, JSON.stringify({ role, expires: Date.now() + 7 * 86400000 }));
    }

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
            remember(role);
            return HttpResponse.json(issue(role));
        }),
        http.post('*/api/auth/refresh', () => {
            let grant;
            try {
                grant = JSON.parse(sessionStorage.getItem(key) ?? 'null') as {
                    role: UserRole;
                    expires: number;
                } | null;
            } catch {
                grant = null;
            }
            if (
                !grant ||
                !['owner', 'client'].includes(grant.role) ||
                !(grant.expires > Date.now())
            ) {
                sessionStorage.removeItem(key);
                return HttpResponse.json({ message: 'Сессия истекла' }, { status: 401 });
            }
            remember(grant.role);
            return HttpResponse.json(issue(grant.role));
        }),
        http.post('*/api/auth/logout', () => {
            sessionStorage.removeItem(key);
            active = null;
            return new HttpResponse(null, { status: 204 });
        }),
    ];
    return { routes, deny };
}
