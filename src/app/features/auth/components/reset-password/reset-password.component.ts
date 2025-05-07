import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@app/features/auth/services/auth";

@Component({
  selector: "app-reset-password",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./reset-password.component.html",
  styleUrl: "./reset-password.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  protected loading = false;
  protected hidePassword = true;
  private token: string | null = null;

  protected resetPasswordForm: FormGroup = this.fb.group(
    {
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", [Validators.required]],
    },
    { validator: this.passwordMatchValidator },
  );

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get("token");
    if (!this.token) {
      this.snackBar.open("Token inválido o expirado", "Cerrar", {
        duration: 5000,
      });
      this.router.navigate(["/forgot-password"]);
    }
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get("password")?.value === g.get("confirmPassword")?.value
      ? null
      : { passwordMismatch: true };
  }

  async onSubmit() {
    if (this.resetPasswordForm.valid && this.token) {
      this.loading = true;
      const newPassword = this.resetPasswordForm.get("password")?.value;

      try {
        await this.authService
          .resetPassword(this.token, newPassword)
          .subscribe({
            next: (response) => {
              this.snackBar.open(
                "Tu contraseña ha sido actualizada exitosamente",
                "Cerrar",
                { duration: 5000 },
              );
              this.router.navigate(["/login"]);
            },
            error: (error) => {
              this.snackBar.open(
                error.message || "Error al restablecer la contraseña",
                "Cerrar",
                { duration: 5000 },
              );
              this.loading = false;
            },
          });
      } catch (error) {
        this.loading = false;
      }
    }
  }
}
