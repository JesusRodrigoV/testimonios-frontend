import { ChangeDetectionStrategy, Component, inject, input, output, signal, Signal } from '@angular/core';
import { ForoComentario } from '../../models';
import { AuthStore } from '@app/auth.store';
import { DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from '@app/features/shared/ui/spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ForumService } from '../../services';

@Component({
  selector: 'app-forum-comment',
  imports: [
    NgClass,
    DatePipe,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    SpinnerComponent,
    TitleCasePipe,
  ],
  templateUrl: './forum-comment.component.html',
  styleUrl: './forum-comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForumCommentComponent {
   private authStore = inject(AuthStore);
  private forumService = inject(ForumService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  comentario = input.required<ForoComentario>();
  isReply = input<boolean>(false);
  topicId = input<string | null>(null);
  startReply = output<number>();
  replySubmitted = output<{ parentId: number; newReply: ForoComentario }>();

  isAuthenticated = this.authStore.isAuthenticated;
  replyForm: FormGroup;
  isSubmitting = signal(false);
  replyError = signal<string | null>(null);
  replyingTo = signal<number | null>(null);

  constructor() {
    this.replyForm = this.fb.group({
      contenido: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  getRoleClass(role: string): string {
    return role.toLowerCase();
  }

  cancelReply(): void {
    this.replyingTo.set(null);
    this.replyError.set(null);
    this.replyForm.reset();
  }

  onSubmitReply(): void {
    if (this.replyForm.invalid) {
      this.replyError.set('La respuesta es requerida');
      return;
    }

    this.isSubmitting.set(true);
    this.replyError.set(null);

    const replyData = {
      contenido: this.replyForm.value.contenido,
      id_forotema: Number(this.topicId()),
      parent_id: this.comentario().id_forocoment,
    };

    this.forumService.createComment(replyData).subscribe({
      next: (newReply) => {
        this.isSubmitting.set(false);
        this.replyForm.reset();
        this.replyingTo.set(null);
        this.replySubmitted.emit({
          parentId: this.comentario().id_forocoment,
          newReply: { ...newReply, children: [] },
        });
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.replyError.set(err.message || 'Error al añadir la respuesta');
        this.snackBar.open(this.replyError() || 'Error desconocido', 'Cerrar', { duration: 5000 });
      },
    });
  }
}