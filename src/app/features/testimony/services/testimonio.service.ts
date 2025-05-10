import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  MapPoint,
  Testimony,
  TestimonyInput,
  TestimonyVersion,
} from "@app/features/testimony/models/testimonio.model";
import { catchError, Observable, of, throwError } from "rxjs";
import { environment } from "src/environment/environment";

@Injectable({
  providedIn: "root",
})
export class TestimonioService {
  private apiUrl = `${environment.apiUrl}`;
  private mediaUrl = this.apiUrl + "/media"

  constructor(private http: HttpClient) {}

  createTestimony(data: TestimonyInput): Observable<Testimony> {
    return this.http.post<Testimony>(this.mediaUrl, data).pipe(
      catchError((error) => {
        console.error("Create testimony error:", error);
        const errorMessage =
          error.error?.error || error.message || "Error al crear testimonio";
        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  getTestimony(id: number): Observable<Testimony> {
    return this.http.get<Testimony>(`${this.mediaUrl}/${id}`).pipe(
      catchError((error) => {
        return throwError(
          () => new Error(error.message || "Testimonio no encontrado"),
        );
      }),
    );
  }

  searchTestimonies(params: {
    keyword?: string;
    dateFrom?: string;
    dateTo?: string;
    authorId?: number;
    category?: string;
    tag?: string;
    eventId?: number;
    page?: number;
    limit?: number;
    highlighted?: boolean;
  }): Observable<{
    data: Testimony[];
    total: number;
    page: number;
    limit: number;
  }> {
    let httpParams = new HttpParams();
    if (params.keyword) httpParams = httpParams.set("keyword", params.keyword);
    if (params.dateFrom)
      httpParams = httpParams.set("dateFrom", params.dateFrom);
    if (params.dateTo) httpParams = httpParams.set("dateTo", params.dateTo);
    if (params.authorId)
      httpParams = httpParams.set("authorId", params.authorId.toString());
    if (params.category)
      httpParams = httpParams.set("category", params.category);
    if (params.tag) httpParams = httpParams.set("tag", params.tag);
    if (params.eventId)
      httpParams = httpParams.set("eventId", params.eventId.toString());
    if (params.page)
      httpParams = httpParams.set("page", params.page.toString());
    if (params.limit)
      httpParams = httpParams.set("limit", params.limit.toString());
    if (params.highlighted)
      httpParams = httpParams.set("highlighted", params.highlighted.toString());

    return this.http
      .get<{
        data: Testimony[];
        total: number;
        page: number;
        limit: number;
      }>(this.mediaUrl, { params: httpParams })
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error(error.message || "Error en la búsqueda"),
          );
        }),
      );
  }

  validateTestimony(
    testimonyId: number,
    approve: boolean,
  ): Observable<{ id: number; status: string }> {
    return this.http
      .post<{
        id: number;
        status: string;
      }>(`${this.mediaUrl}/validate`, { testimonyId, approve })
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error(error.message || "Error al validar testimonio"),
          );
        }),
      );
  }

  getTestimonyVersions(id: number): Observable<TestimonyVersion[]> {
    return this.http
      .get<TestimonyVersion[]>(`${this.mediaUrl}/${id}/versions`)
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error(error.message || "Error al obtener versiones"),
          );
        }),
      );
  }

  getTestimonyMap(): Observable<MapPoint[]> {
    return this.http.get<MapPoint[]>(`${this.mediaUrl}/map/data`).pipe(
      catchError((error) => {
        return throwError(
          () => new Error(error.message || "Error al obtener datos del mapa"),
        );
      }),
    );
  }

  deleteTestimony(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.mediaUrl}/${id}`).pipe(
      catchError((error) => {
        return throwError(
          () => new Error(error.message || "Error al eliminar testimonio"),
        );
      }),
    );
  }

  getAllCategories(): Observable<
    { id_categoria: number; nombre: string; descripcion: string }[]
  > {
    return this.http
      .get<
        { id_categoria: number; nombre: string; descripcion: string }[]
      >(`${this.apiUrl}/categories`)
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error(error.message || "Error al obtener categorías"),
          );
        }),
      );
  }

  getAllTags(): Observable<{ id: number; name: string }[]> {
    return this.http
      .get<{ id: number; name: string }[]>(`${this.apiUrl}/tags`)
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error(error.message || "Error al obtener etiquetas"),
          );
        }),
      );
  }

  getAllEvents(): Observable<
    { id: number; name: string; description: string; date: string }[]
  > {
    return this.http
      .get<
        { id: number; name: string; description: string; date: string }[]
      >(`${this.apiUrl}/events`)
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error(error.message || "Error al obtener eventos"),
          );
        }),
      );
  }

  //Añadir todo esto corregido para ir con el backend
  addFavorite(testimonyId: number): Observable<void> {
    return this.http.post<void>(`/api/testimonies/${testimonyId}/favorite`, {});
  }

  removeFavorite(testimonyId: number): Observable<void> {
    return this.http.delete<void>(`/api/testimonies/${testimonyId}/favorite`);
  }

  rateTestimony(testimonyId: number, rating: number): Observable<number> {
    return this.http.post<number>(`/api/testimonies/${testimonyId}/rate`, { rating });
  }

  downloadTestimony(testimonyId: number): Observable<Blob> {
    return this.http.get(`/api/testimonies/${testimonyId}/download`, { responseType: 'blob' });
  }

  getTranscription(testimonyId: number): Observable<string> {
    return of('Transcripción automática de ejemplo...'); // Mock
  }

  suggestImprovement(testimonyId: number, field: string, value: string): Observable<void> {
    return this.http.post<void>(`/api/testimonies/${testimonyId}/suggestions`, { field, value });
  }
}
