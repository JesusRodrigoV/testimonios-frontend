import { CommonModule, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { Testimony } from '@app/features/testimony/models/testimonio.model';
import { TestimonioService } from '@app/features/testimony/services';
import { ForumService } from '../../services';

@Component({
  selector: 'app-forum-create-topic',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
    RouterLink,
    NgIf
  ],
  templateUrl: './forum-create-topic.component.html',
  styleUrl: './forum-create-topic.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ForumCreateTopicComponent {
  topicForm: FormGroup;
  isSubmitting = false;
  errorMessage: string = "";
  testimonios: Testimony[] = [];

  private forumService = inject(ForumService);
  private testimonioService = inject(TestimonioService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.topicForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', Validators.required],
      id_testimonio: [null],
    });
  }

  ngOnInit(): void {
    this.testimonioService.getAll().subscribe({
      next: (testimonios) => {
        this.testimonios = testimonios;
      },
      error: (err) => {
        this.snackBar.open('Error al cargar testimonios', 'Cerrar', { duration: 5000 });
        console.error('Error fetching testimonios:', err);
      },
    });
  }

  onSubmit(): void {
    if (this.topicForm.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = "";

    const formValue = this.topicForm.value;
    const topicData = {
      titulo: formValue.titulo,
      descripcion: formValue.descripcion,
      id_testimonio: formValue.id_testimonio || undefined,
    };

    this.forumService.createTopic(topicData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.snackBar.open('Tema creado exitosamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/forum']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.message || 'Error al crear el tema';
        this.snackBar.open(this.errorMessage, 'Cerrar', { duration: 5000 });
      },
    });
  }
}
