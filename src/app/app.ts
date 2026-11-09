import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CatalogPageComponent } from '@pages/catalog/ui/catalog-page.component';

import { HeaderComponent } from '@widgets/header/ui/header.component';
import { MyBookingsComponent } from '@widgets/my-bookings/ui/my-bookings.component';

@Component({
    selector: 'app-root',
    imports: [HeaderComponent, RouterOutlet, CatalogPageComponent, MyBookingsComponent],
    templateUrl: './app.html',
    styleUrl: './app.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
