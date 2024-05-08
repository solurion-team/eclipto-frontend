import { Component } from '@angular/core';
import {ActivatedRoute, RouterLink, RouterOutlet} from "@angular/router";
import {WorkspaceService} from "../workspace.service";
import {WorkspaceStore} from "../workspace.store";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [RouterOutlet, RouterLink, AsyncPipe],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent {
  isSidebarActive$ = this.workspaceStore.isSidebarActive$

  constructor(private workspaceStore: WorkspaceStore) {
    // route.params.subscribe(params=> console.log(params["id"]));
    // workspaceService.isSidebarActiveFlow.subscribe(isActive => this.isActiveSidebar = isActive)
  }
}
