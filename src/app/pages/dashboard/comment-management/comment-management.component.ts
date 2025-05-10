import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommentService, TestimonioService } from '../services';
import { Comment, Testimony } from '@app/features/testimony/models/testimonio.model';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, NgClass } from '@angular/common';
import { SpinnerComponent } from '@app/features/shared/ui/spinner';
import { MatButtonModule } from '@angular/material/button';
import { TestimonyDialogComponent } from '../testimony-management/testimony-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-comment-management',
  imports: [DatePipe, MatIconModule, SpinnerComponent, MatButtonModule, NgClass],
  templateUrl: './comment-management.component.html',
  styleUrl: './comment-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentManagementComponent {
  comments: Comment[] = [];
  isLoading = false;
  error: string | null = null;

  private ref = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private commentService = inject(CommentService);
  private testimonyService = inject(TestimonioService);


  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.isLoading = true;
    this.error = null;
    this.commentService.getAllComments().subscribe({
      next: (comments) => {
        this.comments = comments.sort((a, b) =>
          new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
        );
        this.isLoading = false;
        this.ref.detectChanges();
        console.log(this.comments);
      },
      error: (err) => {
        this.error = err.status === 403 ? 'No tienes permiso para ver los comentarios' : 'Error al cargar los comentarios';
        this.isLoading = false;
        this.ref.detectChanges();
      }
    });
  }

  refreshComments() {
    this.loadComments();
  }

  openTestimonyDialog(testimonyID: number): void {
    this.testimonyService.getTestimony(testimonyID).subscribe({
      next: (testimony) => {

        this.dialog.open(TestimonyDialogComponent, {
          width: "600px",
          data: testimony,
        });
      }
    });
  }

  approveComment(id: number) {
    this.commentService.updateCommentStatus(id, 1).subscribe({
      next: () => {
        this.loadComments();
      },
      error: (err) => {
        this.error = err.status === 403 ? 'No tienes permiso para aprobar comentarios' : 'Error al aprobar el comentario';
        this.ref.detectChanges();
      }
    });
  }

  rejectComment(id: number) {
    this.commentService.updateCommentStatus(id, 3).subscribe({
      next: () => {
        this.loadComments();
      },
      error: (err) => {
        this.error = err.status === 403 ? 'No tienes permiso para rechazar comentarios' : 'Error al rechazar el comentario';
        this.ref.detectChanges();
      }
    });
  }

  deleteComment(id: number) {
    this.commentService.deleteComment(id).subscribe({
      next: () => {
        this.loadComments();
      },
      error: (err) => {
        this.error = err.status === 403 ? 'No tienes permiso para eliminar comentarios' : 'Error al eliminar el comentario';
        this.ref.detectChanges();
      }
    });
  }
}