import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthStore } from '@app/auth.store';
import { Comment } from '@app/features/testimony/models/comment.model';
import { CommentService } from '@app/features/testimony/services';
import { CommentFormComponent } from '../../comment-form';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-comment-item',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, CommentFormComponent, DatePipe, NgClass, NgIf],
  templateUrl: './comment-item.component.html',
  styleUrl: './comment-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentItemComponent {
  comment = input.required<Comment>();
  testimonyId = input.required<number>();
  commentUpdated = output<void>();

  replyingTo: number | null = null;
  expanded = false;

  private ref = inject(ChangeDetectorRef);
  private commentService = inject(CommentService);
  private snackBar = inject(MatSnackBar);
  protected authStore = inject(AuthStore);

  getRoleClass(role: string): string {
    const roleLower = role.toLowerCase();
    return ['administrador', 'curador', 'investigador'].includes(roleLower) ? roleLower : '';
  }

  startReply() {
    if (!this.authStore.isAuthenticated()) {
      this.snackBar.open('Inicia sesión para responder', 'Cerrar', { duration: 3000 });
      return;
    }
    this.replyingTo = this.comment().id_comentario;
    this.ref.markForCheck();
  }

  cancelReply() {
    this.replyingTo = null;
    this.ref.markForCheck();
  }

  toggleReplies() {
    this.expanded = !this.expanded;
    this.ref.markForCheck();
  }

  toggleLike() {
    if (!this.authStore.isAuthenticated()) {
      this.snackBar.open('Inicia sesión para dar me gusta', 'Cerrar', { duration: 3000 });
      return;
    }
    const action = this.comment().isLiked
      ? this.commentService.unlikeComment(this.comment().id_comentario)
      : this.commentService.likeComment(this.comment().id_comentario);
    action.subscribe({
      next: () => {
        this.commentUpdated.emit();
      },
      error: () => {
        this.snackBar.open('Error al actualizar me gusta', 'Cerrar', { duration: 3000 });
      },
    });
  }
}
