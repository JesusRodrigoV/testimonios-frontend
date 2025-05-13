import { NgClass } from "@angular/common";
import { Component, ChangeDetectionStrategy, ElementRef, QueryList, ViewChildren, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { animate, stagger, utils } from "animejs";

@Component({
  selector: "app-hero-section",
  imports: [MatButtonModule, MatIconModule, RouterLink, NgClass],
  templateUrl: "./hero-section.component.html",
  styleUrls: ["./hero-section.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSectionComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('squareItem', { read: ElementRef }) squareElements!: QueryList<ElementRef>;

  numRows: number = 6;
  numCols: number = 12;
  rowsArray: number[] = Array(this.numRows).fill(0).map((_, i) => i);
  colsArray: number[] = Array(this.numCols).fill(0).map((_, i) => i);

  private isDestroyed = false;

  constructor() {}

  ngAfterViewInit(): void {
    this.startAnimation();
    this.squareElements.changes.subscribe(() => {
      this.startAnimation();
    });
  }

  startAnimation() {
    if (this.squareElements.length > 0 && !this.isDestroyed) {
      this.animateGrid();
    } else if (!this.isDestroyed) {
      console.warn('HeroSectionComponent: No square elements found to animate.');
    }
  }

  animateGrid() {
    const elements = this.squareElements.toArray().map((el) => el.nativeElement);

    animate(elements, {
        scale: [0, 0.8, 0],
        opacity: [0, 0.7, 0],
        boxShadow: [
          '0 0 0rem 0 currentColor',
          '0 0 0.5rem 0 currentColor',
          '0 0 0rem 0 currentColor',
        ],
      duration: 2500,
      easing: 'easeInOutSine',
      delay: stagger(60, {
        grid: [this.numCols, this.numRows],
        from: utils.random(0, this.numCols * this.numRows - 1),
      }),
      onComplete: () => {
        if (!this.isDestroyed) {
          this.animateGrid();
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
  }

  getRowClass(index: number): string {
    if (index < 2) return 'row-red';
    if (index < 4) return 'row-yellow';
    return 'row-green';
  }
}