import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { VideoPlayerComponent } from "@app/features/shared/video-player";
import { Testimony } from "@app/features/testimony/models/testimonio.model";

@Component({
  selector: "app-testimony-dialog",
  imports: [DatePipe, MatButtonModule, VideoPlayerComponent],
  templateUrl: "./testimony-dialog.component.html",
  styleUrl: "./testimony-dialog.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonyDialogComponent {
  readonly dialogRef = inject(MatDialogRef<TestimonyDialogComponent>);
  readonly testimony = inject<Testimony>(MAT_DIALOG_DATA);
}
