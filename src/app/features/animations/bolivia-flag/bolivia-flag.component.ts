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
import { animate, createScope, utils } from "animejs";
import { stagger } from "animejs";

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

  ngAfterViewInit(): void {
    const gridContainer = this.gridContainer();
    if (!gridContainer?.nativeElement) {
      console.error(
        "gridContainer no está definido. Verifica que #gridContainer esté en el DOM."
      );
      return;
    }
    const scope = createScope({ root: gridContainer.nativeElement });
    scope.add(() => {
      const $circle = utils.$(".circle") as HTMLElement[];
      console.log("Elementos .square encontrados:", $circle.length);
      if ($circle.length === 0) {
        console.warn(
          "No se encontraron elementos .square dentro del gridContainer."
        );
        return;
      }
      this.animateGrid($circle);
    });
  }

  private animateGrid($circle: HTMLElement[]) {
    const from = "center";
    const grid = [20, 21];
    /*
    animate($circle, {
      scale: [
        { to: [0, 1.25], duration: 10 },
        { to: 0, duration: 10 },
      ],
      ease: 'outQuad',
      boxShadow: [
        { to: '0 0 1rem 0 currentColor' },
        { to: '0 0 0rem 0 currentColor' }
      ],
      delay: stagger(50, {
        grid: [43, 46],
        from: utils.random(0, 43 * 46),
      }),
      onComplete: () => {
        this.animateGrid($circle);
      },
    });
    */
    animate($circle, {
      scale: [{ to: [1, 1.7] }, { to: 1 }],
      opacity: [{ to: 1.7 }, { to: 1 }],
      delay: stagger(100, { grid, from }),
      onComplete: () => {
        this.animateGrid($circle);
      },
    });
  }
}
