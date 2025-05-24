import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ForoTema } from '../../models';
import { AsyncPipe, DatePipe, NgOptimizedImage, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@app/features/auth/services/auth';
import { User } from '@app/features/auth/models/user.model';

@Component({
  selector: 'app-forum-post',
  imports: [NgOptimizedImage, MatCardModule, DatePipe],
  templateUrl: './forum-post.component.html',
  styleUrl: './forum-post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForumPostComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  topicInfo = input.required<ForoTema>();
  user: User | null = null;

  ngOnInit() {
    this.authService.getUserInfo(this.topicInfo().creado_por_id_usuario).subscribe({
      next: ((user) => {
        this.user = user;
      })
    });
  }


  goToPost(id: number) {
    this.router.navigate([`forum/post/${id}`]);
  }
}
