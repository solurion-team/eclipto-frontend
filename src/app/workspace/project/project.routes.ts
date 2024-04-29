import { Routes } from '@angular/router';
import {BoardComponent} from "./board/board.component";
import {TaskListComponent} from "./task-list/task-list.component";

export const projectRoutes: Routes = [
  { path: 'board', component: BoardComponent },
  { path: 'list', component: TaskListComponent },
  // { path: 'calendar', component: WorkspaceComponent },
  // { path: 'settings', component:  },
];
