import { CommonModule, DatePipe, NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  signal,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { SpinnerComponent } from "@app/features/shared/ui/spinner";
import { Testimony } from "@app/features/testimony/models/testimonio.model";
import { TestimonyModalComponent } from "./testimony-modal";
import { MatIconModule } from "@angular/material/icon";
import { VideoPlayerComponent } from "@app/features/shared/video-player";
import { Router } from "@angular/router";
import { DateUtilsService } from "@app/core/services";

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
export class TestimonyComponent{
  @Input({ required: true }) testimony!: Testimony;


  private dialog = inject(MatDialog);
  private router = inject(Router);
  private dateUtil = inject(DateUtilsService);

  date = signal<string>(this.dateUtil.getRelativeTime(this.testimony?.createdAt));

  openModal() {
    this.dialog.open(TestimonyModalComponent, {
      data: { testimony: this.testimony },
      maxWidth: "95vw",
      width: "1200px",
      panelClass: "testimony-modal",
    });
  }

  navigateToTestimony() {
    this.router.navigate(['/testimonies', this.testimony.id]);
  }
}

