import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  inject,
  Output,
} from "@angular/core";
import { CommonModule, NgIf, NgOptimizedImage } from "@angular/common";
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
import { ThemeService } from "@app/core/services/theme";

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
    NgIf
  ],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected readonly Rol = Rol;
  isScrolled = false;
  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private themeService = inject(ThemeService);
  isMobileSearchActive = false;
  notificationCount = 0;
  userAvatar = "assets/images/default-avatar.png";

  get darkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  @HostListener("window:scroll")
  onWindowScroll() {
    this.isScrolled = window.scrollY > 0;
  }

  get isAdmin(): boolean {
    return this.authStore.user()?.role === this.Rol.ADMIN;
  }
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  

  toggleMobileSearch(): void {
    this.isMobileSearchActive = !this.isMobileSearchActive;

    if (!this.isMobileSearchActive && this.searchQuery) {
      this.searchQuery = "";
    }

    document.body.style.overflow = this.isMobileSearchActive ? "hidden" : "";
  }

  @HostListener("document:keydown.escape")
  onEscapePress() {
    if (this.isMobileSearchActive) {
      this.toggleMobileSearch();
    }
  }

  onCreatePost() {
    if (!this.authStore.isAuthenticated()) {
      this.router.navigate(["/login"], {
        queryParams: { returnUrl: "/create-post" },
      });
    } else {
      this.router.navigate(["/create-post"]);
    }
  }

  async onLogout() {
    await this.authStore.logout();
  }

  notifications = [
    { id: 1, message: "Nuevo testimonio agregado", read: false },
    { id: 2, message: "Comentario en tu testimonio", read: true },
  ];

  get unreadNotifications(): number {
    return this.notifications.filter((n) => !n.read).length;
  }
  searchQuery = "";

  onSearch(): void {
    this.search.emit(this.searchQuery);
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  markAsRead(notificationId: number): void {
    const notification = this.notifications.find(
      (n) => n.id === notificationId,
    );
    if (notification) {
      notification.read = true;
    }
  }
}
