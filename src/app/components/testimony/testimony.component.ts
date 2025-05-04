import { CommonModule, DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Testimony } from "@app/models/testimonio.model";

@Component({
  selector: "app-testimony",
  imports: [CommonModule, DatePipe],
  templateUrl: "./testimony.component.html",
  styleUrl: "./testimony.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonyComponent {
  @Input({ required: true }) testimony!: Testimony;
}
