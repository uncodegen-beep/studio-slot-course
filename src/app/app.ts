import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from '@widgets/header/ui/header.component';

@Component({
    selector: 'app-root',
    imports: [HeaderComponent, RouterOutlet],
    templateUrl: './app.html',
    styleUrl: './app.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
