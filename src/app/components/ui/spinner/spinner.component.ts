import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "axl-spinner",
  imports: [],
  templateUrl: "./spinner.component.html",
  styleUrl: "./spinner.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {}
