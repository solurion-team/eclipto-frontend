import {Component, Output, EventEmitter, Input} from '@angular/core';
import {AsyncPipe, NgClass} from "@angular/common";
import {ProjectCardComponent, ProjectCardState, ProjectCreatedEvent} from "./project-card/project-card.component";
import {WorkspaceStore} from "../workspace.store";

export interface SidebarState {
  readonly projectCards: ProjectCardState[],
  readonly isLoading: boolean,
  readonly isActive: boolean,
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgClass,
    ProjectCardComponent,
    AsyncPipe
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() state!: SidebarState

  constructor(private readonly workspaceStore: WorkspaceStore) {
  }

  toggleActive() {
    this.workspaceStore.toggleActive()
  }

  addNewProject() {
    this.workspaceStore.setIsAddNewProjectDialogActive(true)
  }

  openProject(projectId: number) {
    this.workspaceStore.openProject(projectId);
  }
}
