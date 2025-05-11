import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { Collection, CollectionTestimony } from '../models/collection.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
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

  addTestimony(collectionId: number, testimonyId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/testimonios`, { id_coleccion: collectionId, id_testimonio: testimonyId });
  }

  removeTestimony(collectionId: number, testimonyId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${collectionId}/testimonios/${testimonyId}`);
  }

  getTestimonies(collectionId: number): Observable<CollectionTestimony[]> {
    return this.http.get<CollectionTestimony[]>(`${this.apiUrl}/${collectionId}/testimonios`);
  }
}
