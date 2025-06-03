
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent {
  private fb = inject(FormBuilder);

  @Input() buttonText: string = "Iniciar sesión";
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Input() showRegisterLink: boolean = true;
  @Output() onSubmit = new EventEmitter<{ email: string; password: string }>();

  hidePassword = true;

  form: FormGroup = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
  });

  submit() {
    if (this.form.valid) {
      this.onSubmit.emit(this.form.value);
    }
  }
}
