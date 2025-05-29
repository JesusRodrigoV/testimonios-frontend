import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { DateUtilsService } from "@app/core/services";
import { Testimony } from "@app/features/testimony/models/testimonio.model";

@Component({
  selector: "app-testimony-card",
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: "./testimony-card.component.html",
  styleUrl: "./testimony-card.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonyCardComponent {
  testimony = input.required<Testimony>();
  edit = output<Testimony>();
  delete = output<Testimony>();

  private dateUtilsService = inject(DateUtilsService);

  getRelativeTime(createdAt: string | Date): string {
    return this.dateUtilsService.getRelativeTime(createdAt);
  }

  onEdit(): void {
    this.edit.emit(this.testimony());
  }

  onDelete(): void {
    this.delete.emit(this.testimony());
  }
}
