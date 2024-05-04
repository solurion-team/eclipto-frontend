import { Component } from '@angular/core';
import {SidebarComponent} from "./sidebar/sidebar.component";
import {ProjectComponent} from "./project/project.component";
import  {AddProjectDialogComponent} from "./add-project-dialog/add-project-dialog.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    SidebarComponent, ProjectComponent, RouterOutlet, AddProjectDialogComponent
  ],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.css'
})
export class WorkspaceComponent {
  openProject() {
    this.router.navigate(['./project/21'], {relativeTo: this.route}).then(r => {})
  }
}

