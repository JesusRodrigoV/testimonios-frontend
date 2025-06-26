import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from "@angular/material/list";
import { TestimonioService } from "@app/features/testimony/services";
import { LeafletModule } from "@bluehalo/ngx-leaflet";
import {
  latLng,
  tileLayer,
  MapOptions,
  Map,
  marker,
  icon,
  LatLng,
} from "leaflet";

@Component({
  selector: "app-maps",
  standalone: true,
  imports: [LeafletModule, MatListModule, MatButtonModule],
  templateUrl: "./maps.component.html",
  styleUrl: "./maps.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MapsComponent {
  private testimonyService = inject(TestimonioService);

  mapReady = output<Map>();

  private map: Map | null = null;

  options: MapOptions = {
    center: latLng(-17.0, -65.0),
    zoom: 5.2,
    layers: [
      tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }),
    ],
  };
  myIcon = icon({
    iconUrl: "assets/images/marker.png",
    iconSize: [40, 40],
    shadowSize: [68, 95],
  });

  testimonios$ = this.testimonyService.getTestimonyMap();

  departments = [
    { name: "Chuquisaca", center: latLng(-19.89, -63.97), zoom: 8 },
    { name: "La Paz", center: latLng(-14.9, -68.14), zoom: 7 },
    { name: "Cochabamba", center: latLng(-17.25, -65.5), zoom: 8 },
    { name: "Oruro", center: latLng(-18.81, -67.8), zoom: 8 },
    { name: "Potosí", center: latLng(-20.35, -66.73), zoom: 7.2 },
    { name: "Tarija", center: latLng(-21.59, -63.79), zoom: 8.2 },
    { name: "Santa Cruz", center: latLng(-16.97, -61.44), zoom: 6.8 },
    { name: "Beni", center: latLng(-13.67, -65.16), zoom: 7 },
    { name: "Pando", center: latLng(-11.08, -67.14), zoom: 8 },
  ] as const;

  onMapReady(map: Map) {
    this.map = map;
    this.mapReady.emit(map);

    this.testimonios$.subscribe({
      next: (testimonios) => {
        testimonios.forEach((testimonio) => {
          const coords = testimonio.coordinates;
          const marca = marker([coords[0], coords[1]], {
            icon: this.myIcon,
            title: testimonio.title,
            riseOnHover: true,
            alt: testimonio.title,
          }).addTo(map);
          marca.bindPopup(testimonio.title);
        });
      },
      error: (err) => {
        console.error("Error al cargar testimonios:", err);
      },
    });
  }

  onBoliviaClick() {
    if (this.map) {
      this.map.flyTo(latLng(-17.0, -65.0), 5.5, {
        animate: true,
        duration: 1.2,
      });
    }
  }

  onDepartmentClick(department: {
    name: string;
    center: LatLng;
    zoom: number;
  }) {
    if (this.map) {
      this.map.flyTo(department.center, department.zoom, {
        animate: true,
        duration: 1.2,
      });
    }
  }
}
