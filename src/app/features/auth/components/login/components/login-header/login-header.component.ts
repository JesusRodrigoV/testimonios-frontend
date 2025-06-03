import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-login-header',
  imports: [NgOptimizedImage],
  templateUrl: './login-header.component.html',
  styleUrl: './login-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginHeaderComponent {
  readonly title = input<string>("Legado de Bolivia");
  readonly subtitle = input<string>("");
}
