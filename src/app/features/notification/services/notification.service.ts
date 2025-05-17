import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, of, map } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Notificacion } from '../model/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly apiUrl = `${environment.apiUrl}/notifications`;

  private http = inject(HttpClient);

  getAll(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error al obtener notificaciones', error);
        return of([]);
      })
    );
  }

  getById(id: number): Observable<Notificacion | null> {
    return this.http.get<Notificacion>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error al obtener notificación ${id}`, error);
        return of(null);
      })
    );
  }

  marcarComoLeido(id: number): Observable<Notificacion | null> {
    return this.http.put<Notificacion>(`${this.apiUrl}/${id}/leer`, {}).pipe(
      catchError((error) => {
        console.error(`Error al marcar notificación ${id} como leída`, error);
        return of(null);
      })
    );
  }

  cambiarEstado(id: number, id_estado: number): Observable<Notificacion | null> {
    return this.http.put<Notificacion>(`${this.apiUrl}/${id}/estado`, { id_estado }).pipe(
      catchError((error) => {
        console.error(`Error al cambiar estado de notificación ${id}`, error);
        return of(null);
      })
    );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { observe: 'response' }).pipe(
      map(() => true),
      catchError((error) => {
        console.error(`Error al eliminar notificación ${id}`, error);
        return of(false);
      })
    );
  }
}
