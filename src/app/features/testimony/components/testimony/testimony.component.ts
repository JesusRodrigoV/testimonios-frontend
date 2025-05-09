import { CommonModule, DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { SpinnerComponent } from "@app/features/shared/ui/spinner";
import { Testimony } from "@app/features/testimony/models/testimonio.model";
import { TestimonyModalComponent } from "./testimony-modal";

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
  private dialog = inject(MatDialog);

  openModal() {
    this.dialog.open(TestimonyModalComponent, {
      data: { testimony: this.testimony },
      maxWidth: '90vw',
      width: '800px',
      panelClass: 'testimony-modal'
    });
  }

}
