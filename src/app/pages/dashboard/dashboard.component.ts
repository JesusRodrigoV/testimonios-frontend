import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { UserManagementComponent } from "./user-management";
import { TestimonyManagementComponent } from "./testimony-management";
import { CommentManagementComponent } from "./comment-management";

@Component({
  selector: "app-dashboard",
  imports: [
    MatTabsModule,
    UserManagementComponent,
    TestimonyManagementComponent,
    CommentManagementComponent
  ],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponent {}
