import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {WorkspaceComponent} from "./workspace/workspace.component";
import {workspaceRoutes} from "./workspace/workspace.routes";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'workspace/:id', component: WorkspaceComponent, children: workspaceRoutes },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
