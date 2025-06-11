import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  output,
  signal,
} from "@angular/core";
import { DatePipe, NgOptimizedImage } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { FormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDividerModule } from "@angular/material/divider";
import { MatBadgeModule } from "@angular/material/badge";
import { AuthStore } from "@app/auth.store";
import { Router, RouterLink } from "@angular/router";
import { GoldenDirective } from "@app/core/directives/golden.directive";
import { ThemeService } from "@app/core/services";
import { SpinnerComponent } from "../ui/spinner";
import { SearchBarComponent } from "../search/components/search-bar";
import { NotificationsMenuComponent } from "@app/features/notification/components/notifications-menu";

export const Rol = {
  ADMIN: 1,
  CURATOR: 2,
  RESEARCHER: 3,
  VISITOR: 4,
} as const;

@Component({
  selector: "app-header",
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule,
    FormsModule,
    MatBadgeModule,
    RouterLink,
    GoldenDirective,
    NgOptimizedImage,
    SearchBarComponent,
    NotificationsMenuComponent
],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  isMobileSearchActive = signal<boolean>(false);

  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private themeService = inject(ThemeService);

  toggleSidebar = output<void>();
  isAdmin = computed(() => this.authStore.user()?.role === Rol.ADMIN);

  constructor() {
    this.authStore.loadUserProfile();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    // Removed isScrolled as it's unused
  }

  onToggleMobileSearch(isActive: boolean) {
    this.isMobileSearchActive.set(isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
  }

  @HostListener('document:keydown.escape')
  onEscapePress() {
    if (this.isMobileSearchActive()) {
      this.onToggleMobileSearch(false);
    }
  }

  async onLogout() {
    await this.authStore.logout();
    await this.router.navigate(['/login']);
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}
