import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from '@widgets/header/ui/header.component';

import { StudioCardComponent } from '@entities/studio/ui/studio-card/studio-card.component';

@Component({
    selector: 'app-root',
    imports: [HeaderComponent, RouterOutlet, StudioCardComponent],
    templateUrl: './app.html',
    styleUrl: './app.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    protected search(query: string): void {
        console.warn('поиск', query);
    }
}
