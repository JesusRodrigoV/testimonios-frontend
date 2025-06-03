import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import {
  TestimonyInput,
  Testimony,
  TestimonyVersion,
  MapPoint,
} from "@app/features/testimony/models/testimonio.model";
import { Observable, catchError, throwError } from "rxjs";
import { environment } from "src/environment/environment";

@Injectable({
  providedIn: "root",
})
export class TestimonioService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/media`;

  createTestimony(data: TestimonyInput): Observable<Testimony> {
    return this.http.post<Testimony>(this.apiUrl, data).pipe(
      catchError((error) => {
        console.error("Create testimony error:", error);
        const errorMessage =
          error.error?.error || error.message || "Error al crear testimonio";
        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  getTestimony(id: number): Observable<Testimony> {
    return this.http.get<Testimony>(`${this.apiUrl}/${id}`).pipe(
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
    status?: string;
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
    if (params.status) httpParams = httpParams.set("status", params.status);

    return this.http
      .get<{
        data: Testimony[];
        total: number;
        page: number;
        limit: number;
      }>(this.apiUrl, { params: httpParams })
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
      }>(`${this.apiUrl}/validate`, { testimonyId, approve })
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
      .get<TestimonyVersion[]>(`${this.apiUrl}/${id}/versions`)
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error(error.message || "Error al obtener versiones"),
          );
        }),
      );
  }

  getTestimonyMap(): Observable<MapPoint[]> {
    return this.http.get<MapPoint[]>(`${this.apiUrl}/map/data`).pipe(
      catchError((error) => {
        return throwError(
          () => new Error(error.message || "Error al obtener datos del mapa"),
        );
      }),
    );
  }

  deleteTestimony(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        return throwError(
          () => new Error(error.message || "Error al eliminar testimonio"),
        );
      }),
    );
  }
}
