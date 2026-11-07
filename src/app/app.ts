import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from '@widgets/header/ui/header.component';

import { DEMO_STUDIOS } from '@entities/studio/model/studios.demo';
import { StudioCardComponent } from '@entities/studio/ui/studio-card/studio-card.component';
import { StudioListComponent } from '@entities/studio/ui/studio-list/studio-list.component';

@Component({
    selector: 'app-root',
    imports: [HeaderComponent, RouterOutlet, StudioCardComponent, StudioListComponent],
    templateUrl: './app.html',
    styleUrl: './app.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    protected readonly studios = DEMO_STUDIOS;

    protected search(query: string): void {
        console.warn('поиск', query);
    }
}
