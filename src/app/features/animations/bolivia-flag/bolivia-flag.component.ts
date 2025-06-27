import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  viewChild,
} from "@angular/core";
import { Circle, StaggerGridService } from "../services";
import { NgClass } from "@angular/common";

@Component({
  selector: "app-bolivia-flag",
  imports: [NgClass],
  templateUrl: "./bolivia-flag.component.html",
  styleUrl: "./bolivia-flag.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoliviaFlagComponent implements OnInit {
  private gridService = inject(StaggerGridService);

  redCircles: Circle[][] = [];
  yellowCircles: Circle[][] = [];
  greenCircles: Circle[][] = [];

  readonly gridContainer = viewChild<ElementRef<HTMLElement>>("gridContainer");

  ngOnInit(): void {
    let redRow: Circle[] = [];
    let yellowRow: Circle[] = [];
    let greenRow: Circle[] = [];

    //Rojos
    this.gridService.agregarBloque(this.redCircles, 20, 7, true);
    //Amarillos
    this.gridService.agregarBloque(this.yellowCircles, 20, 7, true);
    //Verdes
    this.gridService.agregarBloque(this.greenCircles, 20, 7, true);
  }
}
