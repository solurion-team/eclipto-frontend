import { Routes } from '@angular/router';
import {BoardComponent} from "./board/board.component";
import {TaskListComponent} from "./task-list/task-list.component";
import {CalendarComponent} from "./calendar/calendar.component";
import {SettingsComponent} from "./settings/settings.component";

export const projectRoutes: Routes = [
  { path: 'board', component: BoardComponent },
  { path: 'list', component: TaskListComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'settings', component: SettingsComponent },
];
