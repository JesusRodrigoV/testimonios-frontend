import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { ForoComentario } from '../../models';
import { AuthStore } from '@app/auth.store';
import { DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-forum-comment',
  imports: [NgClass, DatePipe, MatIconModule, TitleCasePipe],
  templateUrl: './forum-comment.component.html',
  styleUrl: './forum-comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForumCommentComponent {
  private authStore = inject(AuthStore);

  comentario = input.required<ForoComentario>();
  isReply = input<boolean>(false);
  startReply = output<number>();

  isAuthenticated = this.authStore.isAuthenticated;

  getRoleClass(role: string): string {
    return role.toLowerCase();
  }
}
