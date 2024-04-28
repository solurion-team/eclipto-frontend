import { Component } from '@angular/core';
import {SidebarComponent} from "./sidebar/sidebar.component";

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    SidebarComponent
  ],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.css'
})
export class WorkspaceComponent {

}

