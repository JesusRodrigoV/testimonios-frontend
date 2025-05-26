import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthStore } from '@app/auth.store';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Calificacion } from '../models/calification.model';
import { Testimony } from '../models/testimonio.model';

@Injectable({
  providedIn: 'root'
})
export class CalificationService {
  private readonly apiUrl = `${environment.apiUrl}/score`;
  private http = inject(HttpClient);
  private authStore = inject(AuthStore);

  getAll(): Observable<Calificacion[]> {
    return this.http.get<Calificacion[]>(this.apiUrl).pipe(
      catchError(() => of([]))
    );
  }

  getById(id: number): Observable<Calificacion> {
    return this.http.get<Calificacion>(`${this.apiUrl}/${id}`);
  }

  private normalizeTestimony(testimony: Testimony): Testimony {
    return {
      ...testimony,
      categories: testimony.categories ?? [],
      tags: testimony.tags ?? [],
    };
  }

  getTopRatedTestimonies(limit: number = 5): Observable<Testimony[]> {
    const params = new HttpParams().set("limit", limit.toString());
    return this.http.get<Testimony[]>(`${this.apiUrl}/top-rated`, { params }).pipe(
      map((testimonies) => testimonies.map(this.normalizeTestimony)),
      catchError((error) => {
        const errorMessage = error.error?.error || error.message || "Error al obtener testimonios destacados";
        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  getUserRatingForTestimony(testimonyId: number): Observable<Calificacion | null> {
    if (!this.authStore.isAuthenticated()) {
      return of(null);
    }
    return this.getAll().pipe(
      map(calificaciones => {
        const userId = this.authStore.user()?.id_usuario;
        return calificaciones.find(c => c.id_usuario === userId && c.id_testimonio === testimonyId) || null;
      }),
      catchError(() => of(null))
    );
  }

  create(rating: { puntuacion: number, id_testimonio: number }): Observable<Calificacion> {
    if (!this.authStore.isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }
    if (rating.puntuacion < 1 || rating.puntuacion > 5) {
      throw new Error('La puntuación debe estar entre 1 y 5');
    }
    const payload = {
      puntuacion: rating.puntuacion,
      fecha: new Date().toISOString(),
      id_testimonio: rating.id_testimonio
    };
    return this.http.post<Calificacion>(this.apiUrl, payload);
  }

  update(id: number, rating: Partial<{ puntuacion: number, fecha: string, id_testimonio: number }>): Observable<Calificacion> {
    if (!this.authStore.isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }
    return this.http.put<Calificacion>(`${this.apiUrl}/${id}`, rating);
  }

  delete(id: number): Observable<void> {
    if (!this.authStore.isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
