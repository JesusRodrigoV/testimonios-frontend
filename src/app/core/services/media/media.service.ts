import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MediaService {
  private apiUrl = "hrrp://localhost:4000/api/media";
  private http = inject(HttpClient);

  uploadProfileImage(url: string): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(
      `${this.apiUrl}/upload-profile-image`,
      { url },
    );
  }
  uploadTestimonioMedia(
    url: string,
  ): Observable<{ url: string; optimizedUrl: string; duration: number }> {
    return this.http.post<{
      url: string;
      optimizedUrl: string;
      duration: number;
    }>(`${this.apiUrl}/upload-testimonio-media`, { url });
  }
  uploadFile(file: FormData): Observable<{ url: string; duration: number }> {
    return this.http.post<{ url: string; duration: number }>(
      `${this.apiUrl}/upload-file`,
      file,
    );
  }

  uploadFromUrl(url: string): Observable<{ url: string; duration: number }> {
    return this.http.post<{ url: string; duration: number }>(
      `${this.apiUrl}/upload-from-url`,
      { url },
    );
  }
}
