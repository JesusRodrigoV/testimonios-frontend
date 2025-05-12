import { CommonModule, DatePipe, NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { SpinnerComponent } from "@app/features/shared/ui/spinner";
import { Testimony } from "@app/features/testimony/models/testimonio.model";
import { TestimonyModalComponent } from "./testimony-modal";
import { MatIconModule } from "@angular/material/icon";
import { VideoPlayerComponent } from "@app/features/shared/video-player";

@Component({
  selector: "app-testimony",
  imports: [
    DatePipe,
    SpinnerComponent,
    MatIconModule,
    NgIf,
    VideoPlayerComponent,
  ],
  templateUrl: "./testimony.component.html",
  styleUrl: "./testimony.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonyComponent implements OnInit {
  @Input({ required: true }) testimony!: Testimony;

  private dialog = inject(MatDialog);

  ngOnInit() {
    console.log(this.testimony);
  }

  openModal() {
    this.dialog.open(TestimonyModalComponent, {
      data: { testimony: this.testimony },
      maxWidth: "95vw",
      width: "1200px",
      panelClass: "testimony-modal",
    });
  }
}

