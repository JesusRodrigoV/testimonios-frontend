import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Comment } from '@app/features/testimony/models/comment.model';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-comment-item',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, DatePipe, NgClass, NgIf],
  templateUrl: './comment-item.component.html',
  styleUrl: './comment-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentItemComponent {
  @Input({ required: true }) comment!: Comment;
  @Input() isReply: boolean = false;
  @Input() isLiked: boolean = false;
  @Input() likeCount: number = 0;
  @Input() isAuthenticated: boolean = false;
  @Output() toggleLike = new EventEmitter<number>();
  @Output() startReply = new EventEmitter<number>();

  getRoleClass(role: string): string {
    const roleLower = role.toLowerCase();
    return ['administrador', 'curador', 'investigador'].includes(roleLower) ? roleLower : '';
  }
}
