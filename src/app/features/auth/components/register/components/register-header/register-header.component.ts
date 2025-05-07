import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-register-header',
  imports: [NgOptimizedImage],
  templateUrl: './register-header.component.html',
  styleUrl: './register-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterHeaderComponent {
  @Input() title: string = "Legado de Bolivia";
  @Input() subtitle: string = "Crear Cuenta";
}
