import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${environment.apiUrl}/comments`;
  private http = inject(HttpClient);

  getComments(): Observable<Comment[]> {
    return this.processComments(this.http.get<Comment[]>(`${this.apiUrl}`));
  }

  getByTestimonioId(testimonyId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/testimonio/${testimonyId}`).pipe(
      map((comments) =>
        comments.map((comment) => ({
          ...comment,
          replies: comment.replies ?? [],
        }))
      )
    );
  }

  createComment(comment: { contenido: string; id_testimonio: number; parent_id?: number }): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment).pipe(
      map((comment) => ({
        ...comment,
        replies: comment.replies ?? [],
      }))
    );
  }

  likeComment(commentId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${commentId}/like`, {});
  }

  unlikeComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${commentId}/like`);
  }

  private processComments(comments$: Observable<Comment[]>): Observable<Comment[]> {
    return comments$.pipe(
      map(comments => comments.map(comment => ({
        ...comment,
        likeCount: comment.likes?.length || 0,
        isLiked: comment.likes?.some(like => like.id_usuario === comment.creado_por_id_usuario) || false,
      })))
    );
  }
}
