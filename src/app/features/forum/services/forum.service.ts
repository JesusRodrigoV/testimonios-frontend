import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environment/environment';
import { ForoTema, ForoComentario } from '../models';
import { AuthStore } from '@app/auth.store';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private apiUrl = `${environment.apiUrl}/forumtopics`;
  private commentsApiUrl = `${environment.apiUrl}/forumcomments`;

  private http = inject(HttpClient);

  getAllTopics(): Observable<ForoTema[]> {
    return this.http
      .get<ForoTema[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getMyTopics(): Observable<ForoTema[]> {
    return this.http
      .get<ForoTema[]>(`${this.apiUrl}/mytopics`)
      .pipe(catchError(this.handleError));
  }

  getTopicById(id: number): Observable<ForoTema> {
    return this.http
      .get<ForoTema>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createTopic(data: {
    titulo: string;
    descripcion: string;
    id_evento?: number;
    id_testimonio?: number;
  }): Observable<ForoTema> {
    return this.http
      .post<ForoTema>(this.apiUrl, data)
      .pipe(catchError(this.handleError));
  }

  updateTopic(
    id: number,
    data: {
      titulo?: string;
      descripcion?: string;
      id_evento?: number;
      id_testimonio?: number;
    }
  ): Observable<ForoTema> {
    return this.http
      .put<ForoTema>(`${this.apiUrl}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  deleteTopic(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getCommentsByTopicId(temaId: number): Observable<ForoComentario[]> {
    return this.http
      .get<ForoComentario[]>(`${this.commentsApiUrl}/tema/${temaId}`)
      .pipe(catchError(this.handleError));
  }

   getCommentById(id: number): Observable<ForoComentario> {
    return this.http
      .get<ForoComentario>(`${this.commentsApiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createComment(data: {
    contenido: string;
    id_forotema: number;
    parent_id?: number;
  }): Observable<ForoComentario> {
    return this.http
      .post<ForoComentario>(this.commentsApiUrl, data)
      .pipe(catchError(this.handleError));
  }

  updateComment(id: number, data: { contenido: string }): Observable<ForoComentario> {
    return this.http
      .put<ForoComentario>(`${this.commentsApiUrl}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  deleteComment(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.commentsApiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ocurrió un error';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.error || `Error ${error.status}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
