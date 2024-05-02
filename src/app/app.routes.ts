import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {WorkspaceComponent} from "./workspace/workspace.component";
import {RegisterComponent} from "./register/register.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'workspace/:id', component: WorkspaceComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
