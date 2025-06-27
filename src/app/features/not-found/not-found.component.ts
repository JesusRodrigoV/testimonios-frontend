import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BoliviaFlagComponent } from '../animations/bolivia-flag';

@Component({
  selector: 'app-not-found',
  imports: [BoliviaFlagComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class NotFoundComponent {

}
