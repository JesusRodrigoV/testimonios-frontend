import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
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
import { Router } from "@angular/router";
import { AuthService } from "@app/services/auth";

@Component({
  selector: "app-forgot-password",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./forgot-password.component.html",
  styleUrl: "./forgot-password.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  protected loading = false;
  protected forgotPasswordForm: FormGroup = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
  });

  async onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.loading = true;
      const email = this.forgotPasswordForm.get("email")?.value;

      try {
        await this.authService.requestPasswordReset(email).subscribe({
          next: (response) => {
            this.snackBar.open(
              "Se han enviado las instrucciones a tu correo electrónico",
              "Cerrar",
              { duration: 5000 },
            );
            this.router.navigate(["/login"]);
          },
          error: (error) => {
            this.snackBar.open(
              error.message || "Ocurrió un error al procesar tu solicitud",
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
