import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  inject,
  Output,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { FormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDividerModule } from "@angular/material/divider";
import { MatBadgeModule } from "@angular/material/badge";
import { AuthStore } from "@app/auth.store";
import { Router, RouterLink } from "@angular/router";
import { GoldenDirective } from "@app/directives/golden.directive";

export const Rol = {
  ADMIN: 1,
  CURATOR: 2,
  RESEARCHER: 3,
  VISITOR: 4,
} as const;

@Component({
  selector: "app-header",
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule,
    FormsModule,
    MatBadgeModule,
    RouterLink,
    GoldenDirective,
  ],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected readonly Rol = Rol;
  isScrolled = false;

  @HostListener("window:scroll")
  onWindowScroll() {
    this.isScrolled = window.scrollY > 0;
  }

  get isAdmin(): boolean {
    return this.authStore.user()?.role === this.Rol.ADMIN;
  }
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  isMobileSearchActive = false;
  notificationCount = 0;
  userAvatar = "assets/images/default-avatar.png";

  toggleMobileSearch(): void {
    this.isMobileSearchActive = !this.isMobileSearchActive;

    // Si está cerrando el buscador y hay una búsqueda activa, limpiamos
    if (!this.isMobileSearchActive && this.searchQuery) {
      this.searchQuery = "";
    }

    // Prevenir scroll cuando el buscador está activo
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
