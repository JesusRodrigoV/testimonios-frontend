import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LocationService {
  private locationSubject = new Subject<{
    latitude?: number;
    longitude?: number;
    error?: string;
  }>();
  public location$ = this.locationSubject.asObservable();

  private _shareLocation: boolean = false;

  get shareLocation(): boolean {
    return this._shareLocation;
  }

  set shareLocation(value: boolean) {
    this._shareLocation = value;
    this.onShareLocationChange();
  }

  onShareLocationChange(): void {
    if (this._shareLocation) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = Number(position.coords.latitude.toFixed(2));
            const lon = Number(position.coords.longitude.toFixed(2));
            this.locationSubject.next({ latitude: lat, longitude: lon });
          },
          (error) => {
            console.error("Geolocation error:", error);
            this._shareLocation = false;
            this.locationSubject.next({
              latitude: undefined,
              longitude: undefined,
              error: error.message,
            });
          },
          { enableHighAccuracy: false, timeout: 5000 }
        );
      } else {
        this._shareLocation = false;
        this.locationSubject.next({
          latitude: undefined,
          longitude: undefined,
          error: "Geolocalización no soportada",
        });
      }
    } else {
      this.locationSubject.next({
        latitude: undefined,
        longitude: undefined,
      });
    }
  }

  showSuccess(message: string): void {
    console.log(`Éxito: ${message}`);
  }

  showError(action: string, error: Error): void {
    console.error(`Error al ${action}: ${error.message}`);
  }
}
