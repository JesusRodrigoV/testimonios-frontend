import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { SpinnerComponent } from "@app/features/shared/ui/spinner";
import { VideoPlayerComponent } from "@app/features/shared/video-player";
import { Testimony } from "@app/features/testimony/models/testimonio.model";
import { TestimonioService } from "@app/features/testimony/services";
import { combineLatest } from "rxjs";

@Component({
  selector: "app-testimony-edit",
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatSnackBarModule,
    SpinnerComponent,
    VideoPlayerComponent,
    DatePipe,
  ],
  templateUrl: "./testimony-edit.component.html",
  styleUrl: "./testimony-edit.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TestimonyEditComponent {
  private route = inject(ActivatedRoute);
  private testimonyService = inject(TestimonioService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  testimony = signal<Testimony | null>(null);
  categories = signal<
    { id_categoria: number; nombre: string; descripcion: string }[]
  >([]);
  events = signal<
    { id: number; name: string; description: string; date: string }[]
  >([]);
  allTags = signal<string[]>([]);
  filteredTags = signal<string[]>([]);
  loading = signal<boolean>(true);
  submitting = signal<boolean>(false);
  separatorKeysCodes = [13, 188];
  tagCtrl = new FormControl("");

  form = this.fb.group({
    title: ["", [Validators.required, Validators.minLength(3)]],
    description: ["", [Validators.required, Validators.minLength(5)]],
    content: ["", [Validators.required, Validators.minLength(5)]],
    categories: [[] as string[]],
    tags: [[] as string[]],
    eventId: [null as number | null],
  });

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    if (!isNaN(id)) {
      this.loadData(id);
    }

    effect(
      () => {
        const tags = this.allTags();
        const input = this.tagCtrl.value?.toLowerCase() || "";
        this.filteredTags.set(
          tags.filter(
            (tag) =>
              tag.toLowerCase().includes(input) &&
              !this.form.get("tags")!.value!.includes(tag)
          )
        );
      },
      { allowSignalWrites: true }
    );
  }

  loadData(id: number) {
    this.loading.set(true);
    combineLatest([
      this.testimonyService.getTestimony(id),
      this.testimonyService.getAllCategories(),
      this.testimonyService.getAllEvents(),
      this.testimonyService.getAllTags(),
    ]).subscribe({
      next: ([testimony, categories, events, tags]) => {
        this.testimony.set(testimony);
        this.categories.set(categories);
        this.events.set(events);
        this.allTags.set(tags.map((t) => t.name));
        this.form.patchValue({
          title: testimony.title ?? "",
          description: testimony.description ?? "",
          content: testimony.content ?? "",
          categories: testimony.categories ?? [],
          tags: testimony.tags ?? [],
          eventId: testimony.event ? Number(testimony.event) : null,
        });
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open("Error al cargar el testimonio", "Cerrar", {
          duration: 3000,
        });
        this.router.navigate(["/my-testimonies"]);
        this.loading.set(false);
      },
    });
  }

  addTag(event: any) {
    const value = (event.value || "").trim();
    const currentTags = this.form.get("tags")!.value ?? [];
    if (value && !currentTags.includes(value)) {
      this.form.get("tags")!.setValue([...currentTags, value]);
      this.tagCtrl.setValue("");
      event.chipInput!.clear();
    }
  }

  removeTag(tag: string) {
    const currentTags = this.form.get("tags")!.value ?? [];
    const tags = currentTags.filter((t: string) => t !== tag);
    this.form.get("tags")!.setValue(tags);
  }

  selectedTag(event: any) {
    const value = event.option.value;
    const currentTags = this.form.get("tags")!.value ?? [];
    if (!currentTags.includes(value)) {
      this.form.get("tags")!.setValue([...currentTags, value]);
      this.tagCtrl.setValue("");
    }
  }

  submit() {
    if (this.form.invalid || !this.testimony() || this.submitting()) return;

    this.submitting.set(true);
    const data: Partial<Testimony> = {
      title: this.form.get("title")?.value ?? undefined,
      description: this.form.get("description")?.value ?? undefined,
      content: this.form.get("content")?.value ?? undefined,
      categories: this.form.get("categories")?.value ?? undefined,
      tags: this.form.get("tags")?.value ?? undefined,
      event: this.form.get("eventId")?.value
        ? String(this.form.get("eventId")?.value)
        : undefined,
    };

    this.testimonyService
      .updateTestimony(this.testimony()!.id, data)
      .subscribe({
        next: () => {
          this.snackBar.open("Testimonio actualizado", "Cerrar", {
            duration: 3000,
          });
          this.router.navigate(["/my-testimonies"]);
          this.submitting.set(false);
        },
        error: () => {
          this.snackBar.open("Error al actualizar el testimonio", "Cerrar", {
            duration: 3000,
          });
          this.submitting.set(false);
        },
      });
  }

  cancel() {
    this.router.navigate(["/my-testimonies"]);
  }
}
