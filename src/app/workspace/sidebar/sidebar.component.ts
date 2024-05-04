import {Component, Output, EventEmitter, Input} from '@angular/core';
import {NgClass} from "@angular/common";
import {ProjectCardComponent, ProjectCardState, ProjectCreatedEvent} from "./project-card/project-card.component";
import {WorkspaceService} from "../workspace.service";
import {first} from "rxjs";
import {SidebarStore} from "./sidebar.store";

export interface SidebarState {
  readonly projectCards: ProjectCardState[],
  readonly isActive: boolean,
}

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
  @Input() state!: SidebarState

  readonly projectCards$ = this.sidebarStore.projectCards$
  readonly isActive$ = this.sidebarStore.isActive$

  constructor(private readonly sidebarStore: SidebarStore) {
  }

  toggleActive() {
    this.sidebarStore.toggleActive()
  }

  addProject() {
    this.sidebarStore.addEditingProject()
  }

  removeProject(index: number) {
    this.sidebarStore.removeProjectCard(index)
  }

  openProject(number: number) {

  }

  onProjectCreated(event: ProjectCreatedEvent) {

  }
}
