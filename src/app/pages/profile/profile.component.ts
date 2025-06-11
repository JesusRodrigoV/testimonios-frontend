import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { AuthStore } from "@app/auth.store";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { UserService } from "./services/user.service";
import { ProfileActivityComponent } from "./components/profile-activity";
import { ProfileInfoComponent } from "./components/profile-info";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-profile",
  imports: [
    ProfileInfoComponent,
    ProfileActivityComponent,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfileComponent {
  private authStore = inject(AuthStore);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);

  isLoading = signal<boolean>(false);

  constructor() {
    this.loadTestimonyCount();
  }

  loadTestimonyCount() {
    this.isLoading.set(true);
    this.userService.getTestimonyCount().subscribe({
      next: (count) => {
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error("Error al obtener el conteo de testimonios:", error);
        this.isLoading.set(false);
      },
    });
  }

  async onLogout() {
    this.isLoading.set(true);
    try {
      await this.authStore.logout();
      this.openSnackBar("Sesión cerrada exitosamente", "success");
    } catch (error) {
      this.openSnackBar("Error al cerrar sesión", "error");
    } finally {
      this.isLoading.set(false);
    }
  }

  openSnackBar(message: string, type: "success" | "error") {
    this.snackBar.open(message, "Cerrar", {
      duration: type === "success" ? 3000 : 5000,
      panelClass: type === "success" ? ["snackbar-success"] : ["snackbar-error"],
      verticalPosition: "bottom",
      horizontalPosition: "center",
    });
  }
}