import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Comment } from '@app/features/testimony/models/testimonio.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
private apiUrl = `${environment.apiUrl}/comments`;
  private http = inject(HttpClient);

  getComments(testimonyId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}?id_testimonio=${testimonyId}`);
  }

  getAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/pending`);
  }

  updateCommentStatus(id: number, id_estado: number): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${id}`, { id_estado });
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
