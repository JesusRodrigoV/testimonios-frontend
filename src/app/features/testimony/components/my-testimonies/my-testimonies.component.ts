import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  signal,
} from "@angular/core";
import { Testimony } from "../../models/testimonio.model";
import { TestimonioService } from "../../services";
import { DatePipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-my-testimonies",
  imports: [DatePipe, MatButtonModule],
  templateUrl: "./my-testimonies.component.html",
  styleUrl: "./my-testimonies.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MyTestimoniesComponent implements OnDestroy{
  private testimonyService = inject(TestimonioService);

  protected testimonies = signal<Testimony[]>([]);

  constructor(){
    this.loadTestimonies();
  }

  ngOnDestroy(): void {
  }

  loadTestimonies(): void {
    this.testimonyService.getMyTestimonies().subscribe({
      next: (testimonies) => {
        this.testimonies.set(testimonies);
        console.log(this.testimonies());
      },
      error: (error) => {
        console.error("Error fetching testimonies:", error);
      },
    });
  }

  editTestimony(testimony: Testimony): void {
  }

  deleteTestimony(testimony: Testimony): void {
  }
}
