import { ChangeDetectionStrategy, Component, HostBinding } from "@angular/core";
import { input } from "@angular/core";

@Component({
  selector: "axl-spinner",
  imports: [],
  templateUrl: "./spinner.component.html",
  styleUrl: "./spinner.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  size = input<string | number>('medium');

  @HostBinding('style.--width')
  get width(): string {
    return this.getSizeValue().width;
  }

  @HostBinding('style.--height')
  get height(): string {
    return this.getSizeValue().height;
  }

  @HostBinding('style.--line-thickness')
  get lineThickness(): string {
    return this.getSizeValue().lineThickness;
  }

  private getSizeValue(): { width: string; height: string; lineThickness: string } {
    const size = this.size();
    
    if (typeof size === 'number') {
      return {
        width: `${size}px`,
        height: `${size}px`,
        lineThickness: `${size * 0.1}px`,
      };
    }

    switch (size) {
      case 'small':
        return { width: '30px', height: '30px', lineThickness: '3px' };
      case 'large':
        return { width: '90px', height: '90px', lineThickness: '9px' };
      case 'medium':
      default:
        return { width: '60px', height: '60px', lineThickness: '6px' };
    }
  }
}