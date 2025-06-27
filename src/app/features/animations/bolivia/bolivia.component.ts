import { NgClass } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core';
import { animate, createScope, stagger, utils } from 'animejs';
import { Circle, StaggerGridService } from '../services';

@Component({
  selector: 'app-bolivia',
  imports: [NgClass],
  templateUrl: './bolivia.component.html',
  styleUrl: './bolivia.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoliviaComponent implements AfterViewInit {
  private gridService = inject(StaggerGridService);

  redCircles: Circle[][] = [];
  yellowCircles: Circle[][] = [];
  greenCircles: Circle[][] = [];

  readonly gridContainer = viewChild<ElementRef<HTMLElement>>('gridContainer');

  ngOnInit() {
    const numRows = 3;
    const numCircles = 40;

    let redRow: Circle[] = [];
    let yellowRow: Circle[] = [];
    let greenRow: Circle[] = [];

    this.gridService.agregarCirculos(redRow, 12, false);
    this.gridService.agregarCirculos(redRow, 3, true);
    this.gridService.agregarCirculos(redRow, 28, false);
    this.gridService.agregarFila(this.redCircles, redRow);
    redRow = this.gridService.limpiarArray(redRow);
    this.gridService.agregarCirculos(redRow, 9, false);
    this.gridService.agregarCirculos(redRow, 6, true);
    this.gridService.agregarCirculos(redRow, 28, false);
    this.gridService.agregarFila(this.redCircles, redRow);
    redRow = this.gridService.limpiarArray(redRow);
    this.gridService.agregarCirculos(redRow, 8, false);
    this.gridService.agregarCirculos(redRow, 7, true);
    this.gridService.agregarCirculos(redRow, 28, false);
    this.gridService.agregarFila(this.redCircles, redRow);
    redRow = this.gridService.limpiarArray(redRow);
    this.gridService.agregarCirculos(redRow, 5, false);
    this.gridService.agregarCirculos(redRow, 1, true);
    this.gridService.agregarCirculos(redRow, 1, false);
    this.gridService.agregarCirculos(redRow, 8, true);
    this.gridService.agregarCirculos(redRow, 28, false);
    this.gridService.agregarFila(this.redCircles, redRow);
    redRow = this.gridService.limpiarArray(redRow);
    this.gridService.agregarCirculos(redRow, 5, false);
    this.gridService.agregarCirculos(redRow, 10, true);
    this.gridService.agregarCirculos(redRow, 28, false);
    this.gridService.agregarFila(this.redCircles, redRow);
    redRow = this.gridService.limpiarArray(redRow);
    this.gridService.agregarCirculos(redRow, 15, true);
    this.gridService.agregarCirculos(redRow, 28, false);
    this.gridService.agregarFila(this.redCircles, redRow);
    redRow = this.gridService.limpiarArray(redRow);
    this.gridService.agregarCirculos(redRow, 1, false);
    this.gridService.agregarCirculos(redRow, 15, true);
    this.gridService.agregarCirculos(redRow, 27, false);
    this.gridService.agregarFila(this.redCircles, redRow);
    redRow = this.gridService.limpiarArray(redRow);
    this.gridService.agregarCirculos(redRow, 2, false);
    this.gridService.agregarCirculos(redRow, 14, true);
    this.gridService.agregarCirculos(redRow, 27, false);
    this.gridService.agregarFila(this.redCircles, redRow);
    redRow = this.gridService.limpiarArray(redRow);
    this.gridService.agregarCirculos(redRow, 3, false);
    this.gridService.agregarCirculos(redRow, 15, true);
    this.gridService.agregarCirculos(redRow, 25, false);
    this.gridService.agregarFila(this.redCircles, redRow);
    redRow = this.gridService.limpiarArray(redRow);
    this.gridService.agregarCirculos(redRow, 3, false);
    this.gridService.agregarCirculos(redRow, 16, true);
    this.gridService.agregarCirculos(redRow, 1, false);
    this.gridService.agregarCirculos(redRow, 1, true);
    this.gridService.agregarCirculos(redRow, 22, false);
    this.gridService.agregarFila(this.redCircles, redRow);
    redRow = this.gridService.limpiarArray(redRow);
    this.gridService.agregarCirculos(redRow, 3, false);
    this.gridService.agregarCirculos(redRow, 20, true);
    this.gridService.agregarCirculos(redRow, 20, false);
    this.gridService.agregarFila(this.redCircles, redRow);
    redRow = this.gridService.limpiarArray(redRow);
    this.gridService.agregarCirculos(redRow, 2, false);
    this.gridService.agregarCirculos(redRow, 22, true);
    this.gridService.agregarCirculos(redRow, 19, false);
    this.gridService.agregarFila(this.redCircles, redRow);
    redRow = this.gridService.limpiarArray(redRow);
    this.gridService.agregarCirculos(redRow, 2, false);
    this.gridService.agregarCirculos(redRow, 25, true);
    this.gridService.agregarCirculos(redRow, 16, false);
    this.gridService.agregarFila(this.redCircles, redRow);
    redRow = this.gridService.limpiarArray(redRow);
    this.gridService.agregarCirculos(redRow, 2, false);
    this.gridService.agregarCirculos(redRow, 28, true);
    this.gridService.agregarCirculos(redRow, 13, false);
    this.gridService.agregarFila(this.redCircles, redRow);
    redRow = this.gridService.limpiarArray(redRow);
    this.gridService.agregarCirculos(redRow, 2, false);
    this.gridService.agregarCirculos(redRow, 30, true);
    this.gridService.agregarCirculos(redRow, 11, false);
    this.gridService.agregarFila(this.redCircles, redRow);
    redRow = this.gridService.limpiarArray(redRow);
    this.gridService.agregarCirculos(redRow, 3, false);
    this.gridService.agregarCirculos(redRow, 30, true);
    this.gridService.agregarCirculos(redRow, 10, false);
    this.gridService.agregarFila(this.redCircles, redRow);
    redRow = this.gridService.limpiarArray(redRow);
    this.gridService.agregarCirculos(redRow, 3, false);
    this.gridService.agregarCirculos(redRow, 29, true);
    this.gridService.agregarCirculos(redRow, 11, false);
    this.gridService.agregarFila(this.redCircles, redRow);
    redRow = this.gridService.limpiarArray(redRow);

    //Amarillos
    this.gridService.agregarCirculos(yellowRow, 2, false);
    this.gridService.agregarCirculos(yellowRow, 31, true);
    this.gridService.agregarCirculos(yellowRow, 10, false);
    this.gridService.agregarFila(this.yellowCircles, yellowRow);
    yellowRow = this.gridService.limpiarArray(yellowRow);
    this.gridService.agregarCirculos(yellowRow, 1, false);
    this.gridService.agregarCirculos(yellowRow, 32, true);
    this.gridService.agregarCirculos(yellowRow, 10, false);
    this.gridService.agregarFila(this.yellowCircles, yellowRow);
    yellowRow = this.gridService.limpiarArray(yellowRow);
    this.gridService.agregarCirculos(yellowRow, 2, false);
    this.gridService.agregarCirculos(yellowRow, 30, true);
    this.gridService.agregarCirculos(yellowRow, 11, false);
    this.gridService.agregarFila(this.yellowCircles, yellowRow);
    yellowRow = this.gridService.limpiarArray(yellowRow);
    this.gridService.agregarCirculos(yellowRow, 2, false);
    this.gridService.agregarCirculos(yellowRow, 31, true);
    this.gridService.agregarCirculos(yellowRow, 10, false);
    this.gridService.agregarFila(this.yellowCircles, yellowRow);
    yellowRow = this.gridService.limpiarArray(yellowRow);
    this.gridService.agregarCirculos(yellowRow, 1, false);
    this.gridService.agregarCirculos(yellowRow, 32, true);
    this.gridService.agregarCirculos(yellowRow, 10, false);
    this.gridService.agregarFila(this.yellowCircles, yellowRow);
    yellowRow = this.gridService.limpiarArray(yellowRow);
    this.gridService.agregarCirculos(yellowRow, 1, false);
    this.gridService.agregarCirculos(yellowRow, 32, true);
    this.gridService.agregarCirculos(yellowRow, 10, false);
    this.gridService.agregarFila(this.yellowCircles, yellowRow);
    yellowRow = this.gridService.limpiarArray(yellowRow);
    this.gridService.agregarCirculos(yellowRow, 3, false);
    this.gridService.agregarCirculos(yellowRow, 30, true);
    this.gridService.agregarCirculos(yellowRow, 10, false);
    this.gridService.agregarFila(this.yellowCircles, yellowRow);
    yellowRow = this.gridService.limpiarArray(yellowRow);
    this.gridService.agregarCirculos(yellowRow, 3, false);
    this.gridService.agregarCirculos(yellowRow, 36, true);
    this.gridService.agregarCirculos(yellowRow, 4, false);
    this.gridService.agregarFila(this.yellowCircles, yellowRow);
    yellowRow = this.gridService.limpiarArray(yellowRow);
    this.gridService.agregarCirculos(yellowRow, 2, false);
    this.gridService.agregarCirculos(yellowRow, 36, true);
    this.gridService.agregarCirculos(yellowRow, 5, false);
    this.gridService.agregarFila(this.yellowCircles, yellowRow);
    yellowRow = this.gridService.limpiarArray(yellowRow);
    this.gridService.agregarCirculos(yellowRow, 1, false);
    this.gridService.agregarCirculos(yellowRow, 38, true);
    this.gridService.agregarCirculos(yellowRow, 5, false);
    this.gridService.agregarFila(this.yellowCircles, yellowRow);
    yellowRow = this.gridService.limpiarArray(yellowRow);
    this.gridService.agregarCirculos(yellowRow, 1, false);
    this.gridService.agregarCirculos(yellowRow, 38, true);
    this.gridService.agregarCirculos(yellowRow, 5, false);
    this.gridService.agregarFila(this.yellowCircles, yellowRow);
    yellowRow = this.gridService.limpiarArray(yellowRow);
    this.gridService.agregarCirculos(yellowRow, 1, false);
    this.gridService.agregarCirculos(yellowRow, 39, true);
    this.gridService.agregarCirculos(yellowRow, 3, false);
    this.gridService.agregarFila(this.yellowCircles, yellowRow);
    yellowRow = this.gridService.limpiarArray(yellowRow);
    this.gridService.agregarCirculos(yellowRow, 2, false);
    this.gridService.agregarCirculos(yellowRow, 39, true);
    this.gridService.agregarCirculos(yellowRow, 2, false);
    this.gridService.agregarFila(this.yellowCircles, yellowRow);
    yellowRow = this.gridService.limpiarArray(yellowRow);
    this.gridService.agregarCirculos(yellowRow, 2, false);
    this.gridService.agregarCirculos(yellowRow, 39, true);
    this.gridService.agregarCirculos(yellowRow, 2, false);
    this.gridService.agregarFila(this.yellowCircles, yellowRow);
    yellowRow = this.gridService.limpiarArray(yellowRow);
    this.gridService.agregarCirculos(yellowRow, 3, false);
    this.gridService.agregarCirculos(yellowRow, 40, true);
    this.gridService.agregarCirculos(yellowRow, 0, false);
    this.gridService.agregarFila(this.yellowCircles, yellowRow);
    yellowRow = this.gridService.limpiarArray(yellowRow);
    // Verde
    this.gridService.agregarCirculos(greenRow, 3, false);
    this.gridService.agregarCirculos(greenRow, 39, true);
    this.gridService.agregarCirculos(greenRow, 1, false);
    this.gridService.agregarFila(this.greenCircles, greenRow);
    greenRow = this.gridService.limpiarArray(greenRow);
    this.gridService.agregarCirculos(greenRow, 3, false);
    this.gridService.agregarCirculos(greenRow, 38, true);
    this.gridService.agregarCirculos(greenRow, 2, false);
    this.gridService.agregarFila(this.greenCircles, greenRow);
    greenRow = this.gridService.limpiarArray(greenRow);
    this.gridService.agregarCirculos(greenRow, 4, false);
    this.gridService.agregarCirculos(greenRow, 37, true);
    this.gridService.agregarCirculos(greenRow, 2, false);
    this.gridService.agregarFila(this.greenCircles, greenRow);
    greenRow = this.gridService.limpiarArray(greenRow);
    this.gridService.agregarCirculos(greenRow, 4, false);
    this.gridService.agregarCirculos(greenRow, 27, true);
    this.gridService.agregarCirculos(greenRow, 6, false);
    this.gridService.agregarCirculos(greenRow, 3, true);
    this.gridService.agregarCirculos(greenRow, 3, false);
    this.gridService.agregarFila(this.greenCircles, greenRow);
    greenRow = this.gridService.limpiarArray(greenRow);
    this.gridService.agregarCirculos(greenRow, 4, false);
    this.gridService.agregarCirculos(greenRow, 23, true);
    this.gridService.agregarCirculos(greenRow, 12, false);
    this.gridService.agregarCirculos(greenRow, 1, true);
    this.gridService.agregarCirculos(greenRow, 3, false);
    this.gridService.agregarFila(this.greenCircles, greenRow);
    greenRow = this.gridService.limpiarArray(greenRow);
    this.gridService.agregarCirculos(greenRow, 3, false);
    this.gridService.agregarCirculos(greenRow, 24, true);
    this.gridService.agregarCirculos(greenRow, 12, false);
    this.gridService.agregarCirculos(greenRow, 2, true);
    this.gridService.agregarCirculos(greenRow, 2, false);
    this.gridService.agregarFila(this.greenCircles, greenRow);
    greenRow = this.gridService.limpiarArray(greenRow);
    this.gridService.agregarCirculos(greenRow, 3, false);
    this.gridService.agregarCirculos(greenRow, 23, true);
    this.gridService.agregarCirculos(greenRow, 13, false);
    this.gridService.agregarCirculos(greenRow, 1, true);
    this.gridService.agregarCirculos(greenRow, 3, false);
    this.gridService.agregarFila(this.greenCircles, greenRow);
    greenRow = this.gridService.limpiarArray(greenRow);
    this.gridService.agregarCirculos(greenRow, 4, false);
    this.gridService.agregarCirculos(greenRow, 22, true);
    this.gridService.agregarCirculos(greenRow, 17, false);
    this.gridService.agregarFila(this.greenCircles, greenRow);
    greenRow = this.gridService.limpiarArray(greenRow);
    this.gridService.agregarCirculos(greenRow, 5, false);
    this.gridService.agregarCirculos(greenRow, 21, true);
    this.gridService.agregarCirculos(greenRow, 17, false);
    this.gridService.agregarFila(this.greenCircles, greenRow);
    greenRow = this.gridService.limpiarArray(greenRow);
    this.gridService.agregarCirculos(greenRow, 6, false);
    this.gridService.agregarCirculos(greenRow, 19, true);
    this.gridService.agregarCirculos(greenRow, 18, false);
    this.gridService.agregarFila(this.greenCircles, greenRow);
    greenRow = this.gridService.limpiarArray(greenRow);
    this.gridService.agregarCirculos(greenRow, 6, false);
    this.gridService.agregarCirculos(greenRow, 6, true);
    this.gridService.agregarCirculos(greenRow, 1, false);
    this.gridService.agregarCirculos(greenRow, 12, true);
    this.gridService.agregarCirculos(greenRow, 18, false);
    this.gridService.agregarFila(this.greenCircles, greenRow);
    greenRow = this.gridService.limpiarArray(greenRow);
    this.gridService.agregarCirculos(greenRow, 6, false);
    this.gridService.agregarCirculos(greenRow, 6, true);
    this.gridService.agregarCirculos(greenRow, 2, false);
    this.gridService.agregarCirculos(greenRow, 6, true);
    this.gridService.agregarCirculos(greenRow, 4, false);
    this.gridService.agregarCirculos(greenRow, 1, true);
    this.gridService.agregarCirculos(greenRow, 18, false);
    this.gridService.agregarFila(this.greenCircles, greenRow);
    greenRow = this.gridService.limpiarArray(greenRow);
    this.gridService.agregarCirculos(greenRow, 7, false);
    this.gridService.agregarCirculos(greenRow, 3, true);
    this.gridService.agregarCirculos(greenRow, 8, false);
    this.gridService.agregarCirculos(greenRow, 1, true);
    this.gridService.agregarCirculos(greenRow, 24, false);
    this.gridService.agregarFila(this.greenCircles, greenRow);
    greenRow = this.gridService.limpiarArray(greenRow);
    this.gridService.agregarCirculos(greenRow, 7, false);
    this.gridService.agregarCirculos(greenRow, 3, true);
    this.gridService.agregarCirculos(greenRow, 8, false);
    this.gridService.agregarCirculos(greenRow, 1, true);
    this.gridService.agregarCirculos(greenRow, 24, false);
    this.gridService.agregarFila(this.greenCircles, greenRow);
    greenRow = this.gridService.limpiarArray(greenRow);
  }

  ngAfterViewInit(): void {
    const gridContainer = this.gridContainer();
    if (!gridContainer?.nativeElement) {
      console.error('gridContainer no está definido. Verifica que #gridContainer esté en el DOM.');
      return;
    }
    const scope = createScope({ root: gridContainer.nativeElement });
    scope.add(() => {
      const $circle = utils.$('.circle') as HTMLElement[];
      console.log('Elementos .square encontrados:', $circle.length);
      if ($circle.length === 0) {
        console.warn('No se encontraron elementos .square dentro del gridContainer.');
        return;
      }
      this.animateGrid($circle);
    });
  }

  private animateGrid($circle: HTMLElement[]) {
    const from = utils.random(0, 43 * 46);
    const grid = [43, 46];
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
    translateX: [
      { to: stagger('-.05rem', { grid, from, axis: 'x' }) },
      { to: 0, ease: 'inOutQuad', },
    ],
    translateY: [
      { to: stagger('-.05rem', { grid, from, axis: 'y' }) },
      { to: 0, ease: 'inOutQuad' },
    ],
    opacity: [
      { to: .5 },
      { to: 1 }
    ],
    delay: stagger(100, { grid, from }),
    onComplete: () => {
      this.animateGrid($circle);
    }
  });
  }
}
