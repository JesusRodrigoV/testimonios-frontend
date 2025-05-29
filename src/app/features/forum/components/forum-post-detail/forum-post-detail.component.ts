import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ForumService } from "../../services";
import { ActivatedRoute } from "@angular/router";
import {
  AsyncPipe,
  DatePipe,
  Location,
  NgStyle,
  SlicePipe,
  TitleCasePipe,
} from "@angular/common";
import { ForumCommentComponent } from "../forum-comment";
import { ForoComentario, ForoTema } from "../../models";
import { SpinnerComponent } from "@app/features/shared/ui/spinner";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "app-forum-post-detail",
  imports: [
    DatePipe,
    TitleCasePipe,
    ForumCommentComponent,
    SpinnerComponent,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: "./forum-post-detail.component.html",
  styleUrl: "./forum-post-detail.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ForumPostDetailComponent {
  private location = inject(Location);
  private forumService = inject(ForumService);
  private activatedRoute = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  id = this.activatedRoute.snapshot.paramMap.get('id')!;
  forumPost: ForoTema | null = null;
  forumComments: ForoComentario[] = [];
  isLoadingComments = signal(true);
  commentForm: FormGroup;
  replyForm: FormGroup;
  isSubmitting = signal(false);
  commentError = signal<string | null>(null);
  replyError = signal<string | null>(null);
  replyingTo = signal<number | null>(null);

  constructor() {
    this.commentForm = this.fb.group({
      contenido: ['', [Validators.required, Validators.maxLength(500)]],
    });
    this.replyForm = this.fb.group({
      contenido: ['', [Validators.required, Validators.maxLength(500)]],
    });
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.forumService.getTopicById(Number(this.id)).subscribe({
      next: (data) => {
        this.forumPost = data;
      },
      error: (err) => {
        console.error('Failed to load post', err);
        this.forumPost = null;
        this.snackBar.open('Error al cargar el tema', 'Cerrar', { duration: 5000 });
      },
    });
    this.forumService.getCommentsByTopicId(Number(this.id)).subscribe({
      next: (data) => {
        this.forumComments = data;
        this.isLoadingComments.set(false);
      },
      error: (err) => {
        console.error('Failed to load comments', err);
        this.forumComments = [];
        this.isLoadingComments.set(false);
        this.snackBar.open('Error al cargar comentarios', 'Cerrar', { duration: 5000 });
      },
    });
  }

  onSubmitComment(): void {
    if (this.commentForm.invalid) {
      this.commentError.set('El comentario es requerido');
      return;
    }

    this.isSubmitting.set(true);
    this.commentError.set(null);

    const commentData = {
      contenido: this.commentForm.value.contenido,
      id_forotema: Number(this.id),
    };

    this.forumService.createComment(commentData).subscribe({
      next: (newComment) => {
        this.isSubmitting.set(false);
        this.commentForm.reset();
        this.forumComments = [...this.forumComments, { ...newComment, children: [] }];
        this.snackBar.open('Comentario añadido', 'Cerrar', { duration: 3000 });
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.commentError.set(err.message || 'Error al añadir el comentario');
        this.snackBar.open(this.commentError() || 'Error desconocido', 'Cerrar', { duration: 5000 });
      },
    });
  }

  startReply(commentId: number): void {
    this.replyingTo.set(commentId);
    this.replyForm.reset();
  }

  cancelReply(): void {
    this.replyingTo.set(null);
    this.replyError.set(null);
    this.replyForm.reset();
  }

  onSubmitReply(parentId: number): void {
    if (this.replyForm.invalid) {
      this.replyError.set('La respuesta es requerida');
      return;
    }

    this.isSubmitting.set(true);
    this.replyError.set(null);

    const replyData = {
      contenido: this.replyForm.value.contenido,
      id_forotema: Number(this.id),
      parent_id: parentId,
    };

    this.forumService.createComment(replyData).subscribe({
      next: (newReply) => {
        this.isSubmitting.set(false);
        this.replyForm.reset();
        this.replyingTo.set(null);
        this.forumComments = this.addReplyToComments(this.forumComments, parentId, {
          ...newReply,
          children: [],
        });
        this.snackBar.open('Respuesta añadida', 'Cerrar', { duration: 3000 });
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.replyError.set(err.message || 'Error al añadir la respuesta');
        this.snackBar.open(this.replyError() || 'Error desconocido', 'Cerrar', { duration: 5000 });
      },
    });
  }

  onReplySubmitted({ parentId, newReply }: { parentId: number; newReply: ForoComentario }): void {
    this.forumComments = this.addReplyToComments(this.forumComments, parentId, {
      ...newReply,
      children: [],
    });
    this.snackBar.open('Respuesta añadida', 'Cerrar', { duration: 3000 });
  }

  private addReplyToComments(
    comments: ForoComentario[],
    parentId: number,
    newReply: ForoComentario,
  ): ForoComentario[] {
    return comments.map((comment) => {
      if (comment.id_forocoment === parentId) {
        return {
          ...comment,
          children: [...comment.children, newReply],
        };
      }
      if (comment.children.length > 0) {
        return {
          ...comment,
          children: this.addReplyToComments(comment.children, parentId, newReply),
        };
      }
      return comment;
    });
  }

  goBack() {
    this.location.back();
  }
}
