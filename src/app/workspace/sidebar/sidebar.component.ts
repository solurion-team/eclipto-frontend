import {Component, Output, EventEmitter, Input} from '@angular/core';
import {NgClass} from "@angular/common";
import {ProjectCardComponent} from "./project-card/project-card.component";

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

  @Output() isActiveChange: EventEmitter<boolean> = new EventEmitter<boolean>()
  projects: {projectName: string, projectIconColor: string, isDone: boolean}[] = []

  isActive = false

  showSidebar() {
    this.isActive = !this.isActive
    this.isActiveChange.emit(this.isActive)
  }

  addProject() {
    this.projects.push({projectName: "", projectIconColor: "blue", isDone: false});
  }

  removeProject(index: number) {
    this.projects.splice(index, 1);
  }

}
