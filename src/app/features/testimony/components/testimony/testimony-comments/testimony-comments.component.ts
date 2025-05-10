import { DatePipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SpinnerComponent } from '@app/features/shared/ui/spinner';
import { Comment } from '@app/features/testimony/models/testimonio.model';
import { CommentService } from '@app/features/testimony/services';

@Component({
  selector: 'app-testimony-comments',
  imports: [SpinnerComponent, MatFormFieldModule, MatInputModule, FormsModule, DatePipe, NgIf, MatButtonModule],
  templateUrl: './testimony-comments.component.html',
  styleUrl: './testimony-comments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestimonyCommentsComponent implements OnInit {
  @Input() testimonyId!: number;
  comments: Comment[] = [];
  newComment = '';
  isLoading = false;
  formErrors: { [key: string]: boolean } = {};

  private ref = inject(ChangeDetectorRef);
  private commentService = inject(CommentService);

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.isLoading = true;
    this.commentService.getComments(this.testimonyId).subscribe({
      next: (comments) => {
        this.comments = comments.sort((a, b) => 
          new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
        );
        this.isLoading = false;
        this.ref.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.ref.detectChanges();
      }
    });
  }

  submitComment() {
    if (this.newComment.length < 2) {
      this.formErrors['comment'] = true;
      return;
    }
    this.formErrors['comment'] = false;
    this.commentService.createComment({
      contenido: this.newComment,
      id_testimonio: this.testimonyId
    }).subscribe({
      next: (comment) => {
        this.comments.unshift(comment);
        this.newComment = '';
        this.ref.detectChanges();
      },
      error: () => {
        this.ref.detectChanges();
      }
    });
  }
}