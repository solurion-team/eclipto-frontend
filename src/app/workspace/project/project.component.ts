import { Component } from '@angular/core';
import {ActivatedRoute, RouterLink, RouterOutlet} from "@angular/router";
import {WorkspaceService} from "../workspace.service";

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent {
  isActiveSidebar: boolean = false;

  constructor(private workspaceService: WorkspaceService, private route: ActivatedRoute){
    route.params.subscribe(params=> console.log(params["id"]));
    workspaceService.isSidebarActiveFlow.subscribe(isActive => this.isActiveSidebar = isActive)
  }
}
