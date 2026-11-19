import { DOCUMENT } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    computed,
    inject,
    signal,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { FooterComponent } from '@widgets/footer/ui/footer.component';
import { HeaderComponent } from '@widgets/header/ui/header.component';
import { ToastComponent } from '@widgets/toast/ui/toast.component';

import { online$ } from '@shared/lib/network/online';

@Component({
    selector: 'app-root',
    imports: [FooterComponent, HeaderComponent, RouterOutlet, ToastComponent],
    templateUrl: './app.html',
    styleUrl: './app.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    private readonly router = inject(Router);

    /** Идёт переход — например, resolver ждёт ответ сервера. Сигнал роутера, без подписок */
    protected readonly navigating = computed(() => this.router.currentNavigation() !== null);

    protected readonly online = signal(true);

    constructor() {
        const window = inject(DOCUMENT).defaultView;
        if (window) {
            const subscription = online$(window).subscribe((online) => this.online.set(online));
            inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
        }
    }
}
