import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "src/environment/environment";
import { Collection } from "../models/collection.model";
import { map, Observable, switchMap } from "rxjs";
import { Testimony } from "@app/features/testimony/models/testimonio.model";

@Injectable({
  providedIn: "root",
})
export class CollectionService {
  private apiUrl = `${environment.apiUrl}/collections`;

  private http = inject(HttpClient);

  getAll(): Observable<Collection[]> {
    return this.http.get<Collection[]>(this.apiUrl);
  }

  getById(id: number): Observable<Collection> {
    return this.http.get<Collection>(`${this.apiUrl}/${id}`);
  }

  create(collection: Partial<Collection>): Observable<Collection> {
    return this.http.post<Collection>(this.apiUrl, collection);
  }

  update(id: number, collection: Partial<Collection>): Observable<Collection> {
    return this.http.put<Collection>(`${this.apiUrl}/${id}`, collection);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getFavoritesCollectionId(): Observable<number> {
    return this.getAll().pipe(
      map((collections) =>
        collections.find((c) => c.titulo === 'Favoritos')?.id_coleccion
      ),
      map((id) => {
        if (!id) {
          throw new Error('Colección Favoritos no encontrada');
        }
        return id;
      })
    );
  }

  getFavoriteCount(id: number): Observable<number> {
    return this.http
      .get<{ favoriteCount: number }>(`${this.apiUrl}/favorite-count/${id}`)
      .pipe(map((response) => response.favoriteCount));
  }

  getFavorites(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/favorites/ids`);
  }

  toggleFavorite(testimonyId: number): Observable<any> {
    return this.getFavoritesCollectionId().pipe(
      switchMap((collectionId) =>
        this.http.post(`${this.apiUrl}/testimonios`, {
          id_coleccion: collectionId,
          id_testimonio: testimonyId,
        })
      )
    );
  }

  addTestimony(collectionId: number, testimonyId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/testimonios`, {
      id_coleccion: collectionId,
      id_testimonio: testimonyId,
    });
  }

  removeTestimony(collectionId: number, testimonyId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${collectionId}/testimonios/${testimonyId}`,
    );
  }

  getTestimonies(collectionId: number): Observable<Testimony[]> {
    return this.http
      .get<{ data: Testimony[] }>(`${this.apiUrl}/${collectionId}/testimonios`)
      .pipe(map((response) => response.data));
  }

}
