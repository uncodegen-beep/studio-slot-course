import type { SessionUser } from '@entities/session/model/session.store';

/** Владелец и студия в его списке. Одна проверка для списка студий и для guard страницы студии */
export function ownsStudio(user: SessionUser | null, studioId: string): boolean {
    return user?.role === 'owner' && user.studioIds.includes(studioId);
}

// Задание модуля 04 (tasks/module-04): допишите здесь ownsStudioGuard и ownerStudioResolver
