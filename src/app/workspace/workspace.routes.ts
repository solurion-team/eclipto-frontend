import { Routes } from '@angular/router';
import {ProjectComponent} from "./project/project.component";
import {projectRoutes} from "./project/project.routes";

export const workspaceRoutes: Routes = [
  { path: 'project/:id', component: ProjectComponent, children: projectRoutes }
];
