import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { ClockComponent } from '@shared/ui/clock/clock.component';

@Component({
    selector: 'app-header',
    imports: [ClockComponent, RouterLink, RouterLinkActive],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
    protected readonly appName = 'StudioSlot';
}
