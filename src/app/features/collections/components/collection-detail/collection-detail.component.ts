import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Collection, CollectionTestimony } from "../../models/collection.model";
import { Testimony } from "@app/features/testimony/models/testimonio.model";
import { CollectionService } from "../../services";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TestimonyComponent } from "@app/features/testimony/components/testimony";
import { SpinnerComponent } from "@app/features/shared/ui/spinner";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-collection-detail",
  imports: [
    MatIconModule,
    MatButtonModule,
    TestimonyComponent,
    SpinnerComponent,
    DatePipe,
  ],
  templateUrl: "./collection-detail.component.html",
  styleUrl: "./collection-detail.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CollectionDetailComponent {
  collection = signal<Collection | null>(null);
  testimonies = signal<Testimony[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  private collectionService = inject(CollectionService);
  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);

  constructor() {
    const id = parseInt(this.route.snapshot.paramMap.get("id") || "0", 10);
    if (id) {
      this.loadCollection(id);
      this.loadTestimonies(id);
    } else {
      this.error.set("ID de colección no válido");
    }
  }

  loadCollection(id: number) {
    this.loading.set(true);
    this.collectionService.getById(id).subscribe({
      next: (collection) => {
        this.collection.set(collection);
        this.loading.set(false);
      },
      error: () => {
        this.error.set("Error al cargar la colección");
        this.snackBar.open("Error al cargar la colección", "Cerrar", {
          duration: 3000,
        });
        this.loading.set(false);
      },
    });
  }

  loadTestimonies(id: number) {
    console.log("El id para cargar testimonios: " + id);
    this.loading.set(true);
    this.collectionService.getTestimonies(id).subscribe({
      next: (testimonies: Testimony[]) => {
        console.log("Testimonios recibidos:", testimonies);
        this.testimonies.set(testimonies);
        console.log("Testimonios cargados:", testimonies);
        this.loading.set(false);
      },
      error: () => {
        this.error.set("Error al cargar los testimonios");
        this.snackBar.open("Error al cargar los testimonios", "Cerrar", {
          duration: 3000,
        });
        this.loading.set(false);
      },
    });
  }
}

