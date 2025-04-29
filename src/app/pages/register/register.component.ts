import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import {
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgIf, NgOptimizedImage } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { Router, RouterLink } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "@app/services/auth";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-register",
  imports: [
    RouterLink,
    MatFormFieldModule,
    ReactiveFormsModule,
    NgIf,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    NgOptimizedImage,
  ],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  loading = signal(false);
  error = signal<string | null>(null);
  hidePassword = true;
  hideConfirmPassword = true;

  registerForm: FormGroup = this.fb.group(
    {
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", [Validators.required]],
      nombre: ["", [Validators.required, Validators.minLength(3)]],
      biografia: [""],
    },
    {
      validators: this.passwordMatchValidator,
    },
  );

  private passwordMatchValidator(g: FormGroup) {
    return g.get("password")?.value === g.get("confirmPassword")?.value
      ? null
      : { mismatch: true };
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      this.loading.set(true);
      this.error.set(null);

      try {
        const { confirmPassword, ...registrationData } =
          this.registerForm.value;
        await firstValueFrom(this.authService.register(registrationData));

        this.snackBar.open(
          "Registro exitoso! Por favor inicia sesión",
          "Cerrar",
          {
            duration: 5000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
          },
        );

        await this.router.navigate(["/login"]);
      } catch (error: any) {
        this.error.set(
          error.error?.message || error.message || "Error al registrar usuario",
        );
      } finally {
        this.loading.set(false);
      }
    }
  }
}
