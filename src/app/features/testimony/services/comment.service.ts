import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Comment } from '../models/testimonio.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${environment.apiUrl}/comments`;
  private http = inject(HttpClient);

  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}`);
  }
  
  getCommentsByTestimonyId(testimonyId: number): Observable<Comment[]> {
    return this.getComments().pipe(
      map(comments => comments.filter(comment => comment.id_testimonio === testimonyId))
    );
  }

  getByTestimonioId(testimonyId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/testimonio/${testimonyId}`);
  }

  createComment(comment: { contenido: string; id_testimonio: number }): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment);
  }
}
