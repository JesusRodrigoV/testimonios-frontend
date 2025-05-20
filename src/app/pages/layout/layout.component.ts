import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '@app/core/services';
import { FooterComponent } from '@app/features/shared/footer';
import { HeaderComponent } from '@app/features/shared/header';
import { SidenavComponent } from '@app/features/shared/sidenav';
import { BoliviaComponent } from '@app/features/animations/bolivia';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, MatButtonModule, MatIconModule, SidenavComponent, FooterComponent, HeaderComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LayoutComponent {
  isSidenavExpanded = true;

  readonly themeService = inject(ThemeService);

  onToggleSidenav() {
    this.isSidenavExpanded = !this.isSidenavExpanded;
  }
}