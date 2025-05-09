import { DatePipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Testimony } from '@app/features/testimony/models/testimonio.model';
import { TestimonyCommentsComponent } from '../testimony-comments';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-testimony-modal',
  imports: [MatIconModule, DatePipe, TestimonyCommentsComponent, NgIf, MatButtonModule],
  templateUrl: './testimony-modal.component.html',
  styleUrl: './testimony-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestimonyModalComponent {
  testimony: Testimony;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { testimony: Testimony },
    private dialogRef: MatDialogRef<TestimonyModalComponent>
  ) {
    this.testimony = data.testimony;
  }

  closeModal() {
    this.dialogRef.close();
  }
}
