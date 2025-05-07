import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-login-header',
  imports: [NgOptimizedImage],
  templateUrl: './login-header.component.html',
  styleUrl: './login-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginHeaderComponent {
  @Input() title: string = "Legado de Bolivia";
  @Input() subtitle: string = "";
}
