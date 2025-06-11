import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-profile-activity",
  imports: [MatCardModule],
  templateUrl: "./profile-activity.component.html",
  styleUrl: "./profile-activity.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileActivityComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);

  isLoading = input<boolean>();
  private userService = inject(UserService);

  testimonyCount = signal<number>(0);
  averageRating = signal<number | null>(null);
  approvedCommentsCount = signal<number | null>(null);
  favoriteCount = signal<number | null>(null);

  ngOnInit() {
    this.loadActivityData();
  }

  loadActivityData() {
    this.userService.getTestimonyCount().subscribe({
      next: (count) => {
        console.log("Conteo de testimonios:", count);
        this.testimonyCount.set(count);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Error al obtener el conteo de testimonios:", error);
        this.testimonyCount.set(0); 
        this.cdr.detectChanges(); 
      },
    });

    // Placeholders para futuros endpoints (descomentar e implementar cuando estén disponibles)
    // this.userService.getAverageRating().subscribe(rating => this.averageRating.set(rating));
    // this.userService.getApprovedCommentsCount().subscribe(count => this.approvedCommentsCount.set(count));
    // this.userService.getFavoriteCount().subscribe(count => this.favoriteCount.set(count));
  }
}
