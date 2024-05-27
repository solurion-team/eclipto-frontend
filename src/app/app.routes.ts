import {Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {WorkspaceComponent} from "./workspace/workspace.component";
import {workspaceRoutes} from "./workspace/workspace.routes";
import {RegisterComponent} from "./register/register.component";
import {authenticatedGuard} from "./app.guard";


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [authenticatedGuard] },
  { path: 'workspace/:id', component: WorkspaceComponent, children: workspaceRoutes, canActivate: [authenticatedGuard] },
  { path: '**', redirectTo: '/login' },
];


