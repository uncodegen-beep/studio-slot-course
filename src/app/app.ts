import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from '@widgets/footer/ui/footer.component';
import { HeaderComponent } from '@widgets/header/ui/header.component';

@Component({
    selector: 'app-root',
    imports: [HeaderComponent, RouterOutlet, FooterComponent],
    templateUrl: './app.html',
    styleUrl: './app.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
