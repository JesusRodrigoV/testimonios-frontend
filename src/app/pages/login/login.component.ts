import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import {
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from "@angular/forms";
import { AuthStore } from "@app/auth.store";
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgIf } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-login",
  imports: [
    RouterLink,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
  private readonly authStore = inject(AuthStore);
  private readonly fb = inject(FormBuilder);

  hidePassword = true;

  loginForm: FormGroup = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
  });

  loading = this.authStore.loading;
  error = this.authStore.error;

  async onSubmit() {
    if (this.loginForm.valid) {
      await this.authStore.login(this.loginForm.value);
    }
  }
}
