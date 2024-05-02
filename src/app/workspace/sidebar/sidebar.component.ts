import {Component, Output, EventEmitter, Input} from '@angular/core';
import {NgClass} from "@angular/common";
import {ProjectCardComponent} from "./project-card/project-card.component";
import {WorkspaceService} from "../workspace.service";
import {first} from "rxjs";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgClass,
    ProjectCardComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  projects: {projectName: string, projectIconColor: string, isDone: boolean}[] = []

  isActive = false

  constructor(private workspaceService: WorkspaceService) {
    workspaceService.isSidebarActiveFlow.subscribe(isActive => this.isActive = isActive)
  }

  showSidebar() {
    this.workspaceService.switchActive()
  }

  addProject() {
    this.projects.push({projectName: "", projectIconColor: "blue", isDone: false});
  }

  removeProject(index: number) {
    this.projects.splice(index, 1);
  }

}
