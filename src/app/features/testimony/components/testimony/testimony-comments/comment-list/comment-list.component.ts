import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { SpinnerComponent } from '@app/features/shared/ui/spinner';
import { CommentItemComponent } from './comment-item';
import { Comment } from '@app/features/testimony/models/comment.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthStore } from '@app/auth.store';
import { CommentService } from '@app/features/testimony/services';
import { CommentFormComponent } from '../comment-form';
import { MatIconModule } from '@angular/material/icon';
import { NgStyle } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-comment-list',
  imports: [SpinnerComponent, CommentItemComponent, CommentFormComponent, MatIconModule, NgStyle, MatButtonModule],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentListComponent {
  comments = input.required<Comment[]>();
  isLoading = input<boolean>(false);
  testimonyId = input.required<number>();
  commentsUpdated = output<void>();

  replyingTo: number | null = null;
  expandedReplies: { [key: number]: boolean } = {};
  flattenedComments: (Comment & { depth: number })[] = [];

  private authStore = inject(AuthStore);
  private commentService = inject(CommentService);
  private snackBar = inject(MatSnackBar);

  get isAuthenticated(): boolean {
    return this.authStore.isAuthenticated();
  }

  ngOnChanges() {
    this.flattenedComments = this.flattenComments(this.comments());
  }

  private flattenComments(comments: Comment[], depth: number = 0): (Comment & { depth: number })[] {
    const result: (Comment & { depth: number })[] = [];
    for (const comment of comments) {
      result.push({ ...comment, depth, replies: comment.replies || [] });
      if (this.expandedReplies[comment.id_comentario] && comment.replies?.length > 0) {
        result.push(...this.flattenComments(comment.replies, depth + 1));
      }
    }
    return result;
  }

  startReply(commentId: number) {
    if (!this.isAuthenticated) {
      this.snackBar.open('Inicia sesión para responder', 'Cerrar', { duration: 3000 });
      return;
    }
    this.replyingTo = commentId;
  }

  cancelReply() {
    this.replyingTo = null;
  }

  toggleReplies(commentId: number) {
    this.expandedReplies[commentId] = !this.expandedReplies[commentId];
    this.flattenedComments = this.flattenComments(this.comments());
    this.commentsUpdated.emit();
  }

  toggleLike(commentId: number) {
    if (!this.isAuthenticated) {
      this.snackBar.open('Inicia sesión para dar me gusta', 'Cerrar', { duration: 3000 });
      return;
    }
    const comment = this.flattenedComments.find(c => c.id_comentario === commentId);
    if (!comment) return;

    const action = comment.isLiked
      ? this.commentService.unlikeComment(commentId)
      : this.commentService.likeComment(commentId);
    action.subscribe({
      next: () => {
        this.loadComments();
      },
      error: () => {
        this.snackBar.open('Error al actualizar me gusta', 'Cerrar', { duration: 3000 });
      },
    });
  }

  loadComments() {
    this.commentsUpdated.emit();
  }
}