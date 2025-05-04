import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-hero-section",
  imports: [MatButtonModule, MatIconModule, RouterLink],
  templateUrl: "./hero-section.component.html",
  styleUrls: ["./hero-section.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSectionComponent {}
