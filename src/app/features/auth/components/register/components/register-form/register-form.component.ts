import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterFormComponent {
  private fb = inject(FormBuilder);

  @Input() buttonText: string = "Crear cuenta";
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Output() onSubmit = new EventEmitter<any>();

  hidePassword = true;
  hideConfirmPassword = true;

  form: FormGroup = this.fb.group(
    {
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", [Validators.required]],
      nombre: ["", [Validators.required, Validators.minLength(3)]],
      biografia: [""],
    },
    {
      validators: this.passwordMatchValidator,
    }
  );

  private passwordMatchValidator(g: FormGroup) {
    return g.get("password")?.value === g.get("confirmPassword")?.value
      ? null
      : { mismatch: true };
  }
}
