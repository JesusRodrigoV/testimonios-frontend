import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { Testimony } from "../../models/testimonio.model";
import { TestimonioService } from "../../services";
import { AuthStore } from "@app/auth.store";

@Component({
  selector: "app-my-testimonies",
  imports: [],
  templateUrl: "./my-testimonies.component.html",
  styleUrl: "./my-testimonies.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MyTestimoniesComponent implements OnInit {
  private testimonyService = inject(TestimonioService);
  private readonly authStore = inject(AuthStore);

  user = this.authStore.user;
  private testimonies: Testimony[] = [];

  ngOnInit(): void {
    console.log(this.user);
    //    this.testimonyService.getMyTestimonies();
  }
}
