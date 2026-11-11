import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import type { Observable } from 'rxjs';

import type { Studio } from '@shared/model';

/**
 * Доступ к данным студий. Компоненты не знают адресов и HttpClient — только методы сервиса.
 * providedIn: 'root' — один экземпляр, создаётся при первом inject и не попадёт в бандл, если не нужен
 */
@Injectable({ providedIn: 'root' })
export class StudiosApi {
    private readonly http = inject(HttpClient);

    /** Пока API нет — JSON-заглушка из public/api; путь без «/» в начале ради GitHub Pages */
    getById(id: string): Observable<Studio> {
        return this.http.get<Studio>(`api/studios/${id}.json`);
    }
}
