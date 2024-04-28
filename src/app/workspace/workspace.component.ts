import { Component } from '@angular/core';
import {SidebarComponent} from "./sidebar/sidebar.component";
import {ProjectComponent} from "./project/project.component";

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    SidebarComponent, ProjectComponent
  ],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.css'
})
export class WorkspaceComponent {
  isActiveSidebar : boolean = false
}

