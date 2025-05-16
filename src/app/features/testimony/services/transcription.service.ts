import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Transcripcion, TranscripcionResponse } from '../models/transcription.model';

@Injectable({
  providedIn: 'root'
})
export class TranscriptionService {
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(MatSnackBar);
  private readonly apiUrl = `${environment.apiUrl}/transcription`;

  transcribirArchivo(testimonioId: number): Observable<Transcripcion> {
    return this.http
      .post<TranscripcionResponse>(
        `${this.apiUrl}/${testimonioId}/transcribir`,
        {},
      )
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error('Error al solicitar transcripción');
          }
          return response.data as Transcripcion;
        }),
        catchError((error) => {
          const message =
            error.status === 403
              ? 'No tienes permiso para transcribir este testimonio'
              : error.status === 404
                ? 'Testimonio no encontrado'
                : error.status === 401
                  ? 'Usuario no autenticado'
                  : 'Error al procesar la transcripción';
          this.snackBar.open(message, 'Cerrar', { duration: 5000 });
          return throwError(() => new Error(message));
        })
      );
  }

  obtenerTranscripcion(id: number): Observable<Transcripcion> {
    return this.http
      .get<TranscripcionResponse>(`${this.apiUrl}/transcripciones/${id}`)
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error('Error al obtener transcripción');
          }
          return response.data as Transcripcion;
        }),
        catchError((error) => {
          const message =
            error.status === 404
              ? 'Transcripción no encontrada'
              : error.status === 401
                ? 'Usuario no autenticado'
                : 'Error al obtener la transcripción';
          this.snackBar.open(message, 'Cerrar', { duration: 5000 });
          return throwError(() => new Error(message));
        })
      );
  }

  obtenerTranscripcionesPorTestimonio(testimonioId: number): Observable<Transcripcion[]> {
    return this.http
      .get<TranscripcionResponse>(`${this.apiUrl}/${testimonioId}/transcripciones`)
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error('Error al obtener transcripciones');
          }
          return response.data as Transcripcion[];
        }),
        catchError((error) => {
          const message =
            error.status === 401
              ? 'Usuario no autenticado'
              : 'Error al obtener las transcripciones';
          this.snackBar.open(message, 'Cerrar', { duration: 5000 });
          return throwError(() => new Error(message));
        })
      );
  }
}
