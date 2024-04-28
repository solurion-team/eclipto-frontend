import { Component } from '@angular/core';
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

  projects: {projectName: string, projectIconColor: string, isDone: boolean}[] = [
    {projectName: "Eclipto", projectIconColor: "blue", isDone: true}
  ]

  isActive = false

  showSidebar() {
    this.isActive = !this.isActive
  }

  addProject() {
    this.projects.push({projectName: "", projectIconColor: "blue", isDone: false});
  }

  removeProject(index: number) {
    this.projects.splice(index, 1);
  }

}
