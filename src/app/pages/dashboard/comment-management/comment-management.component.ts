import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommentService, TestimonioService } from '../services';
import { Comment } from '@app/features/testimony/models/comment.model';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, NgClass } from '@angular/common';
import { SpinnerComponent } from '@app/features/shared/ui/spinner';
import { MatButtonModule } from '@angular/material/button';
import { TestimonyDialogComponent } from '../testimony-management/testimony-dialog';
import { MatDialog } from '@angular/material/dialog';
import { RepliesDialogComponent } from './replies-dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment-management',
  imports: [DatePipe, MatIconModule, SpinnerComponent, MatButtonModule, NgClass, MatTooltipModule, MatFormFieldModule, MatSelectModule, FormsModule],
  templateUrl: './comment-management.component.html',
  styleUrl: './comment-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentManagementComponent {
  comments: Comment[] = [];
  filteredComments: Comment[] = [];
  isLoading = false;
  error: string | null = null;
  statusFilter: string = 'all';

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
        console.log('Loaded comments:', comments); // Debug log
        this.comments = comments.sort(
          (a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
        );
        this.applyFilters();
        this.isLoading = false;
        this.ref.detectChanges();
      },
      error: (err) => {
        this.error =
          err.status === 403
            ? 'No tienes permiso para ver los comentarios'
            : 'Error al cargar los comentarios';
        this.isLoading = false;
        this.ref.detectChanges();
      },
    });
  }

  applyFilters() {
    this.filteredComments = this.comments.filter((comment) => {
      if (this.statusFilter === 'all') return true;
      return comment.id_estado === parseInt(this.statusFilter);
    });
    this.ref.detectChanges();
  }

  refreshComments() {
    this.loadComments();
  }

  openTestimonyDialog(testimonyId: number): void {
    this.testimonyService.getTestimony(testimonyId).subscribe({
      next: (testimony) => {
        this.dialog.open(TestimonyDialogComponent, {
          width: '600px',
          data: testimony,
        });
      },
      error: () => {
        this.error = 'Error al cargar el testimonio';
        this.ref.detectChanges();
      },
    });
  }

  openRepliesDialog(comment: Comment): void {
    this.dialog.open(RepliesDialogComponent, {
      width: '600px',
      data: { comment, replies: comment.replies },
    });
  }

  approveComment(id: number) {
    this.commentService.updateCommentStatus(id, 2).subscribe({
      next: () => {
        this.loadComments();
      },
      error: (err) => {
        this.error =
          err.status === 403
            ? 'No tienes permiso para aprobar comentarios'
            : 'Error al aprobar el comentario';
        this.ref.detectChanges();
      },
    });
  }

  rejectComment(id: number) {
    this.commentService.updateCommentStatus(id, 3).subscribe({
      next: () => {
        this.loadComments();
      },
      error: (err) => {
        this.error =
          err.status === 403
            ? 'No tienes permiso para rechazar comentarios'
            : 'Error al rechazar el comentario';
        this.ref.detectChanges();
      },
    });
  }

  deleteComment(id: number) {
    this.commentService.deleteComment(id).subscribe({
      next: () => {
        this.loadComments();
      },
      error: (err) => {
        this.error =
          err.status === 403
            ? 'No tienes permiso para eliminar comentarios'
            : 'Error al eliminar el comentario';
        this.ref.detectChanges();
      },
    });
  }

  getRoleClass(role: string): string {
    return role.toLowerCase();
  }
}