import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { Testimony } from "@app/features/testimony/models/testimonio.model";
import { TestimonioService } from "@app/features/testimony/services";

@Component({
  selector: "app-testimony-edit",
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
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
  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      title: ["", Validators.required],
      content: ["", Validators.required],
    });

    const id = Number(this.route.snapshot.paramMap.get("id"));
    if (!isNaN(id)) {
      this.testimonyService.getTestimony(id).subscribe({
        next: (testimony) => {
          this.testimony.set(testimony);
          this.form.patchValue({
            title: testimony.title,
            content: testimony.content,
          });
        },
        error: () => {
          this.snackBar.open("Error al cargar el testimonio", "Cerrar", {
            duration: 3000,
          });
          this.router.navigate(["/my-testimonies"]);
        },
      });
    }
  }

  submit(): void {
    if (this.form.invalid || !this.testimony()) return;

    const data: Partial<Testimony> = this.form.value;
    this.testimonyService
      .updateTestimony(this.testimony()!.id, data)
      .subscribe({
        next: () => {
          this.snackBar.open("Testimonio actualizado", "Cerrar", {
            duration: 3000,
          });
          this.router.navigate(["/my-testimonies"]);
        },
        error: () => {
          this.snackBar.open("Error al actualizar el testimonio", "Cerrar", {
            duration: 3000,
          });
        },
      });
  }
}
