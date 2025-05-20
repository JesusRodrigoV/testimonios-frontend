import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
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
  @Input({ required: true }) testimonyId!: number;
  comments: Comment[] = [];
  isLoading = false;

  private ref = inject(ChangeDetectorRef);
  private commentService = inject(CommentService);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.isLoading = true;
    this.ref.markForCheck();
    this.commentService.getByTestimonioId(this.testimonyId).subscribe({
      next: (comments) => {
        this.comments = comments.map((comment) => ({
          ...comment,
          replies: comment.replies ?? [],
        }));
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
}

