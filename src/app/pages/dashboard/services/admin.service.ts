import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "@app/features/auth/models/user.model";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AdminService {
  private readonly API_URL = "http://localhost:4000/auth";
  private http = inject(HttpClient);

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/users`);
  }

  createUser(userData: Partial<User>): Observable<User> {
    const { id_usuario, ...userWithoutId } = userData;
    return this.http.post<User>(`${this.API_URL}/users`, userWithoutId);
  }

  updateUser(id_usr: number, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/users/${id_usr}`, userData);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/users/${id}`).pipe(
      tap({
        next: () => console.log('AdminService - deleteUser exitoso'),
        error: (error) => console.error('AdminService - deleteUser error:', error)
      })
    );
  }
}
