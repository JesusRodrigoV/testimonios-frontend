import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  inject,
  output,
  Output,
} from "@angular/core";
import { CommonModule, DatePipe, NgIf, NgOptimizedImage } from "@angular/common";
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
import { Notificacion } from "@app/features/notification/model/notification.model";
import { NotificationService } from "@app/features/notification/services";
import { SpinnerComponent } from "../ui/spinner/spinner.component";

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
    NgIf,
    SpinnerComponent,
    DatePipe
],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected readonly Rol = Rol;
  isScrolled = false;
  isMobileSearchActive = false;
  userAvatar = 'assets/images/default-avatar.png';
  notifications: Notificacion[] = [];
  isLoading = false;
  error: string | null = null;
  searchQuery = '';
  filterType: 'recent' | 'popular' | 'category' | null = null;

  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private themeService = inject(ThemeService);
  private readonly notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);

  toggleSidebar = output<void>();
  search = output<{ query: string; filter?: string }>();

  constructor() {
    this.loadNotifications();
    setInterval(() => {
      this.loadNotifications();
      this.cdr.detectChanges();
    }, 5000);
  }

  get darkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 0;
    this.cdr.markForCheck();
  }

  get isAdmin(): boolean {
    return this.authStore.user()?.role === this.Rol.ADMIN;
  }

  toggleMobileSearch(): void {
    this.isMobileSearchActive = !this.isMobileSearchActive;
    if (!this.isMobileSearchActive && this.searchQuery) {
      this.searchQuery = '';
    }
    document.body.style.overflow = this.isMobileSearchActive ? 'hidden' : '';
    this.cdr.markForCheck();
  }

  @HostListener('document:keydown.escape')
  onEscapePress() {
    if (this.isMobileSearchActive) {
      this.toggleMobileSearch();
    }
  }

  onCreatePost() {
    if (!this.authStore.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/create-post' },
      });
    } else {
      this.router.navigate(['/create-post']);
    }
  }

  async onLogout() {
    await this.authStore.logout();
    this.cdr.detectChanges();
  }

  onSearch(): void {
    this.search.emit({
      query: this.searchQuery,
      filter: this.filterType || undefined,
    });
    if (this.isMobileSearchActive) {
      this.toggleMobileSearch();
    }
  }

  setFilter(type: 'recent' | 'popular' | 'category'): void {
    this.filterType = type;
    this.onSearch();
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  get unreadNotifications(): number {
    return this.notifications.filter((n) => !n.leido).length;
  }

  loadNotifications(): void {
    if (!this.authStore.isAuthenticated()) {
      this.notifications = [];
      this.cdr.markForCheck();
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.notificationService.getUnread().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'No se pudieron cargar las notificaciones';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  markAsRead(id: number): void {
    this.notificationService.marcarComoLeido(id).subscribe({
      next: (updatedNotification) => {
        if (updatedNotification) {
          this.notifications = this.notifications.map((n) =>
            n.id_notificacion === id ? updatedNotification : n
          );
          this.cdr.markForCheck();
        }
      },
      error: () => {
        this.cdr.markForCheck();
      },
    });
  }
}
