import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';

import { of } from 'rxjs';

import { FooterComponent } from '@widgets/footer/ui/footer.component';
import { HeaderComponent } from '@widgets/header/ui/header.component';
import { ToastComponent } from '@widgets/toast/ui/toast.component';

import { GlobalLoading } from '@shared/api/interceptors/http.interceptors';
import { online$ } from '@shared/lib/network/online';

@Component({
    selector: 'app-root',
    imports: [FooterComponent, HeaderComponent, RouterOutlet, ToastComponent],
    templateUrl: './app.html',
    styleUrl: './app.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    protected readonly loading = inject(GlobalLoading);
    private readonly router = inject(Router);

    /** Идёт переход — например, resolver ждёт ответ сервера. Сигнал роутера, без подписок */
    protected readonly navigating = computed(() => this.router.currentNavigation() !== null);

    private readonly window = inject(DOCUMENT).defaultView;

    /** Есть ли сеть. Без window (рендер на сервере, модуль 13) считаем, что есть */
    protected readonly online = toSignal(this.window ? online$(this.window) : of(true), {
        initialValue: true,
    });
}
