import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Comment } from '../models/testimonio.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${environment.apiUrl}/comments`;
  private http = inject(HttpClient);

  getComments(testimonyId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}?id_testimonio=${testimonyId}`);
  }

  getByTestimonioId(testimonyId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/testimonio/${testimonyId}`);
  }

  createComment(comment: { contenido: string; id_testimonio: number }): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment);
  }
}
