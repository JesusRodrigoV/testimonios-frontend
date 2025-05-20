import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { AuthStore } from '@app/auth.store';
import { Comment } from '@app/features/testimony/models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${environment.apiUrl}/comments`;
  private http = inject(HttpClient);
  private authStore = inject(AuthStore);

  getComments(testimonyId: number): Observable<Comment[]> {
    return this.processComments(
      this.http.get<Comment[]>(`${this.apiUrl}?id_testimonio=${testimonyId}`)
    );
  }

  getAllComments(): Observable<Comment[]> {
    return this.processComments(
      this.http.get<Comment[]>(`${this.apiUrl}/pending`)
    );
  }

  getByTestimonioId(testimonyId: number): Observable<Comment[]> {
    return this.processComments(
      this.http.get<Comment[]>(`${this.apiUrl}/testimonio/${testimonyId}`)
    );
  }

  updateCommentStatus(id: number, id_estado: number): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${id}`, { id_estado });
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private processComments(comments$: Observable<Comment[]>): Observable<Comment[]> {
    return comments$.pipe(
      map(comments =>
        comments
          .map(comment => {
            if (!comment.testimonios) {
              console.warn(`Comment ${comment.id_comentario} has no testimonios`, comment);
            }
            return {
              ...comment,
              likeCount: comment.likes?.length || 0,
              isLiked: comment.likes?.some(
                like => like.id_usuario === this.authStore.user()?.id_usuario
              ) || false,
            };
          })
          // Optional: Filter out comments with missing testimonios
          // .filter(comment => !!comment.testimonios)
      )
    );
  }
}