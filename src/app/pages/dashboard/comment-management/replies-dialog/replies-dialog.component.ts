import { DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Comment } from '@app/features/testimony/models/comment.model';

@Component({
  selector: 'app-replies-dialog',
  imports: [MatIconModule, MatButtonModule, DatePipe, NgClass, MatDialogModule],
  templateUrl: './replies-dialog.component.html',
  styleUrl: './replies-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepliesDialogComponent {
  dialogRef = inject<MatDialogRef<RepliesDialogComponent>>(MatDialogRef);
  data = inject<{
    comment: Comment;
    replies: Comment[];
}>(MAT_DIALOG_DATA);


  getRoleClass(role: string): string {
    return role.toLowerCase();
  }
}
