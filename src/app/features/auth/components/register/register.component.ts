import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "@app/features/auth/services/auth";
import { firstValueFrom } from "rxjs";
import { RegisterFormComponent, RegisterHeaderComponent } from "./components";

@Component({
  selector: "app-register",
  imports: [
    MatCardModule,
    RegisterHeaderComponent,
    RegisterFormComponent
  ],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  loading = signal(false);
  error = signal<string | null>(null);

  async onSubmit(formData: any) {
    if (formData) {
      this.loading.set(true);
      this.error.set(null);

      try {
        const { confirmPassword, ...registrationData } = formData;
        await firstValueFrom(this.authService.register(registrationData));

        this.snackBar.open(
          "Registro exitoso! Por favor inicia sesión",
          "Cerrar",
          {
            duration: 5000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
          }
        );

        await this.router.navigate(["/login"]);
      } catch (error: any) {
        this.error.set(
          error.error?.message || error.message || "Error al registrar usuario"
        );
      } finally {
        this.loading.set(false);
      }
    }
  }
}
