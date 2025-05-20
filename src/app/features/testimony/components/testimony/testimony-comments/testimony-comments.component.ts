import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthStore } from "@app/auth.store";
import { Comment } from "@app/features/testimony/models/comment.model";
import { CommentService } from "@app/features/testimony/services";
import { CommentListComponent } from "./comment-list/comment-list.component";
import { CommentFormComponent } from "./comment-form";

@Component({
  selector: "app-testimony-comments",
  imports: [
    CommentListComponent,
    CommentFormComponent
  ],
  templateUrl: "./testimony-comments.component.html",
  styleUrl: "./testimony-comments.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonyCommentsComponent implements OnInit {
  @Input() testimonyId!: number;
  comments: Comment[] = [];
  newComment = "";
  newReply = '';
  replyingTo: number | null = null;
  expandedReplies: { [key: number]: boolean } = {};
  isLoading = false;
  formErrors: { [key: string]: boolean } = {};

  private ref = inject(ChangeDetectorRef);
  private commentService = inject(CommentService);
  private snackBar = inject(MatSnackBar);
  protected authStore = inject(AuthStore);

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.isLoading = true;
    this.commentService.getByTestimonioId(this.testimonyId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.isLoading = false;
        this.ref.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Error al cargar comentarios', 'Cerrar', { duration: 3000 });
        this.ref.markForCheck();
      },
    });
  }

  submitComment() {
    if (this.newComment.length < 2) {
      this.formErrors['comment'] = true;
      this.ref.markForCheck();
      return;
    }
    this.formErrors['comment'] = false;
    this.commentService
      .createComment({
        contenido: this.newComment,
        id_testimonio: this.testimonyId,
      })
      .subscribe({
        next: () => {
          this.newComment = '';
          this.loadComments();
          this.snackBar.open('Comentario creado. Esperando aprobación', 'Cerrar', {
            duration: 3000,
          });
        },
        error: () => {
          this.snackBar.open('Error al crear comentario', 'Cerrar', { duration: 3000 });
          this.ref.markForCheck();
        },
      });
  }

  submitReply(parentId: number) {
    if (this.newReply.length < 2) {
      this.formErrors['reply'] = true;
      this.ref.markForCheck();
      return;
    }
    this.formErrors['reply'] = false;
    this.commentService
      .createComment({
        contenido: this.newReply,
        id_testimonio: this.testimonyId,
        parent_id: parentId,
      })
      .subscribe({
        next: () => {
          this.newReply = '';
          this.replyingTo = null;
          this.loadComments();
          this.snackBar.open('Respuesta creada. Esperando aprobación', 'Cerrar', {
            duration: 3000,
          });
        },
        error: () => {
          this.snackBar.open('Error al crear respuesta', 'Cerrar', { duration: 3000 });
          this.ref.markForCheck();
        },
      });
  }

  startReply(commentId: number) {
    if (!this.authStore.isAuthenticated()) {
      this.snackBar.open('Inicia sesión para responder', 'Cerrar', { duration: 3000 });
      return;
    }
    this.replyingTo = commentId;
    this.newReply = '';
    this.ref.markForCheck();
  }

  cancelReply() {
    this.replyingTo = null;
    this.newReply = '';
    this.formErrors['reply'] = false;
    this.ref.markForCheck();
  }

  toggleReplies(commentId: number) {
    this.expandedReplies[commentId] = !this.expandedReplies[commentId];
    this.ref.markForCheck();
  }

  toggleLike(comment: Comment) {
    if (!this.authStore.isAuthenticated()) {
      this.snackBar.open('Inicia sesión para dar me gusta', 'Cerrar', { duration: 3000 });
      return;
    }
    const action = comment.isLiked
      ? this.commentService.unlikeComment(comment.id_comentario)
      : this.commentService.likeComment(comment.id_comentario);
    action.subscribe({
      next: () => {
        this.loadComments();
      },
      error: () => {
        this.snackBar.open('Error al actualizar me gusta', 'Cerrar', { duration: 3000 });
      },
    });
  }

  getRoleClass(role: string): string {
    return role.toLowerCase();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action);
  }
}

