import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CatalogPageComponent } from '@pages/catalog/ui/catalog-page.component';

import { HeaderComponent } from '@widgets/header/ui/header.component';

@Component({
    selector: 'app-root',
    imports: [HeaderComponent, RouterOutlet, CatalogPageComponent],
    templateUrl: './app.html',
    styleUrl: './app.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
