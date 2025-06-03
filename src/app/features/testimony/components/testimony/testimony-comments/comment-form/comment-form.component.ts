
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Output, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthStore } from '@app/auth.store';
import { CommentService } from '@app/features/testimony/services';

@Component({
  selector: 'app-comment-form',
  imports: [FormsModule, MatButtonModule],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentFormComponent {
  readonly formType = input<'comment' | 'reply'>('comment');
  readonly testimonyId = input.required<number>();
  readonly parentId = input<number>();
  @Output() commentSubmitted = new EventEmitter<void>();

  content = '';
  formErrors: { [key: string]: boolean } = {};

  private ref = inject(ChangeDetectorRef);
  private commentService = inject(CommentService);
  private snackBar = inject(MatSnackBar);
  private authStore = inject(AuthStore);

  submit() {
    if (!this.authStore.isAuthenticated()) {
      this.snackBar.open('Inicia sesión para comentar', 'Cerrar', { duration: 3000 });
      return;
    }
    if (this.content.length < 2) {
      this.formErrors['content'] = true;
      this.ref.markForCheck();
      return;
    }
    this.formErrors['content'] = false;
    this.commentService
      .createComment({
        contenido: this.content,
        id_testimonio: this.testimonyId(),
        parent_id: this.parentId(),
      })
      .subscribe({
        next: () => {
          this.content = '';
          this.commentSubmitted.emit();
          this.snackBar.open(
            `${this.formType() === 'comment' ? 'Comentario' : 'Respuesta'} creada. Esperando aprobación`,
            'Cerrar',
            { duration: 3000 }
          );
        },
        error: () => {
          this.snackBar.open(`Error al crear ${this.formType() === 'comment' ? 'comentario' : 'respuesta'}`, 'Cerrar', { duration: 3000 });
          this.ref.markForCheck();
        },
      });
  }

  cancel() {
    this.content = '';
    this.formErrors['content'] = false;
    this.commentSubmitted.emit();
    this.ref.markForCheck();
  }
}
