import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Testimony } from "@app/models/testimonio.model";

@Component({
  selector: "app-testimony-list",
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: "./testimony-list.component.html",
  styleUrl: "./testimony-list.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonyListComponent {
  @Input() testimonies: Testimony[] = [];
  @Output() searchChanged = new EventEmitter<string>();
  searchQuery = "";

  viewTestimony(testimony: Testimony): void {
    console.log("Ver testimonio:", testimony);
    // Aquí puedes implementar la lógica para navegar a la vista del testimonio
  }

  onSearch(): void {
    this.searchChanged.emit(this.searchQuery);
  }
}
