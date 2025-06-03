import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterLink } from "@angular/router";
import { ForumPostComponent } from "@app/features/forum/components/forum-post";
import { ForumService } from "@app/features/forum/services";

@Component({
  selector: "app-forum",
  imports: [
    AsyncPipe,
    ForumPostComponent,
    RouterLink,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: "./forum.component.html",
  styleUrl: "./forum.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ForumComponent {
  private forumService = inject(ForumService);

  topics$ = this.forumService.getAllTopics();
  ngOnInit(){
    this.forumService.getAllTopics().subscribe({
      next: (topic)=> {
        console.log(topic);
      }
    });
  }
}
