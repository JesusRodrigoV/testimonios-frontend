import { ChangeDetectionStrategy, Component, OnInit, Output, EventEmitter, inject, output } from '@angular/core';
import { TestimonioService } from '@app/features/testimony/services';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { latLng, tileLayer, MapOptions, Map, marker, circle, icon } from 'leaflet';

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [LeafletModule],
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class MapsComponent {
  private testimonyService = inject(TestimonioService);
  
  mapReady = output<Map>();

  private map: Map | null = null;

  options: MapOptions = {
    center: latLng(-17.0, -65.0),
    zoom: 5,
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
    ]
  };
  myIcon = icon({
    iconUrl: 'assets/images/marker.png',
    iconSize: [40, 40],
    shadowSize: [68, 95],
  });
  
  

  testimonios$ = this.testimonyService.getTestimonyMap();

  onMapReady(map: Map) {
    this.map = map;
    this.mapReady.emit(map);

    this.testimonios$.subscribe({
      next: (testimonios) => {
        testimonios.forEach(testimonio => {
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
        console.error('Error al cargar testimonios:', err);
      }
    });
  }
}