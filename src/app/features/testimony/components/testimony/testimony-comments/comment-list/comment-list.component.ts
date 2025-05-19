import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { SpinnerComponent } from '@app/features/shared/ui/spinner';
import { CommentItemComponent } from './comment-item';
import { Comment } from '@app/features/testimony/models/comment.model';

@Component({
  selector: 'app-comment-list',
  imports: [SpinnerComponent, CommentItemComponent],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentListComponent {
  comments = input<Comment[]>();
  isLoading = input<boolean>(false);
  testimonyId = input.required<number>();
  commentsUpdated = output<void>();
}
