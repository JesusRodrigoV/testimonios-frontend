import { CommonModule, DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Testimony } from "@app/models/testimonio.model";
import { SpinnerComponent } from "../ui/spinner";

@Component({
  selector: "app-testimony",
  imports: [CommonModule, DatePipe, SpinnerComponent],
  templateUrl: "./testimony.component.html",
  styleUrl: "./testimony.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonyComponent {
  @Input({ required: true }) testimony!: Testimony;
  if(testimony: any) {
    console.log(testimony);
  }
}
