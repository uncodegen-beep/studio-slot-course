import { Injectable, computed, signal } from '@angular/core';

export type UserRole = 'client' | 'owner';

export interface SessionUser {
    readonly name: string;
    readonly role: UserRole;
    /** Студии, которыми управляет владелец. У клиента — пусто */
    readonly studioIds: readonly string[];
}

/** Демо-владелец управляет двумя студиями из каталога */
const DEMO_OWNER_STUDIOS: readonly string[] = ['sound-garden', 'nevsky-beat'];

export interface Session {
    user: SessionUser;
    accessToken: string;
}
export function demoUser(role: UserRole): SessionUser {
    return role === 'owner'
        ? { name: 'Владелец студии', role, studioIds: DEMO_OWNER_STUDIOS }
        : { name: 'Клиент', role, studioIds: [] };
}
@Injectable({ providedIn: 'root' })
export class SessionStore {
    private readonly current = signal<Session | null>(null);
    readonly user = computed(() => this.current()?.user ?? null);
    readonly accessToken = computed(() => this.current()?.accessToken ?? null);
    readonly isSignedIn = computed(() => this.current() !== null);
    readonly role = computed(() => this.user()?.role ?? null);
    private version = 0;
    get sessionVersion(): number {
        return this.version;
    }
    renew(session: Session): void {
        this.current.set(session);
    }
    establish(session: Session): void {
        this.version++;
        this.current.set(session);
    }
    signIn(role: UserRole): void {
        this.establish({ user: demoUser(role), accessToken: crypto.randomUUID() });
    }
    signOut(): void {
        this.version++;
        this.current.set(null);
    }
}
