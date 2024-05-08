import {Component, Output, EventEmitter, Input} from '@angular/core';
import {AsyncPipe, NgClass} from "@angular/common";
import {ProjectCardComponent, ProjectCardState, ProjectCreatedEvent} from "./project-card/project-card.component";
import {WorkspaceStore} from "../workspace.store";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AddProjectDialogComponent} from "../add-project-dialog/add-project-dialog.component";

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
    this.workspaceStore.openAddProjectDialog()
  }

  openProject(projectId: number) {
    this.workspaceStore.openProject(projectId);
  }
}
