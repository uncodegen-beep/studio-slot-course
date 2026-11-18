import { Injectable, computed, effect, signal } from '@angular/core';

export type UserRole = 'client' | 'owner';

export interface SessionUser {
    readonly name: string;
    readonly role: UserRole;
    /** Студии, которыми управляет владелец. У клиента — пусто */
    readonly studioIds: readonly string[];
}

/** Демо-владелец управляет двумя студиями из каталога */
const DEMO_OWNER_STUDIOS: readonly string[] = ['sound-garden', 'nevsky-beat'];

const STORAGE_KEY = 'studioslot.session';

function isSessionUser(value: unknown): value is SessionUser {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    const { name, role, studioIds } = value as Record<string, unknown>;
    return (
        typeof name === 'string' &&
        (role === 'client' || role === 'owner') &&
        Array.isArray(studioIds) &&
        studioIds.every((id) => typeof id === 'string')
    );
}

function readSaved(): SessionUser | null {
    try {
        const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
        return isSessionUser(saved) ? saved : null;
    } catch {
        return null;
    }
}

/**
 * Кто вошёл и с какой ролью. Пока это демо-вход без сервера:
 * настоящая авторизация через OAuth и токены — модуль 06
 */
@Injectable({ providedIn: 'root' })
export class SessionStore {
    private readonly current = signal<SessionUser | null>(readSaved());

    readonly user = this.current.asReadonly();
    readonly isSignedIn = computed(() => this.current() !== null);
    readonly role = computed(() => this.current()?.role ?? null);

    constructor() {
        effect(() => {
            const user = this.current();
            try {
                if (user) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
                } else {
                    localStorage.removeItem(STORAGE_KEY);
                }
            } catch {
                // хранилище недоступно — сессия живёт до перезагрузки
            }
        });
    }

    signIn(role: UserRole): void {
        this.current.set(
            role === 'owner'
                ? { name: 'Владелец студии', role, studioIds: DEMO_OWNER_STUDIOS }
                : { name: 'Клиент', role, studioIds: [] },
        );
    }

    signOut(): void {
        this.current.set(null);
    }
}
