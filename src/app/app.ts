import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { FooterComponent } from '@widgets/footer/ui/footer.component';
import { HeaderComponent } from '@widgets/header/ui/header.component';
import { ToastComponent } from '@widgets/toast/ui/toast.component';

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
}
