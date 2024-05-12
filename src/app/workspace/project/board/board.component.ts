import { Component } from '@angular/core';
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatButtonToggle} from "@angular/material/button-toggle";
import {MatButton, MatFabButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {AddProjectDialogComponent} from "../../add-project-dialog/add-project-dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AddTaskStatusDialogComponent} from "./add-task-status-dialog/add-task-status-dialog.component";
import {AddTaskDialogComponent} from "./add-task-dialog/add-task-dialog.component";
// import {
//   CdkDragDrop,
//   moveItemInArray,
//   transferArrayItem,
//   CdkDrag,
//   CdkDropList,
// } from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    MatCardContent,
    MatCard,
    MatButtonToggle,
    MatButton,
    MatIcon,
    MatFabButton,
    MatIconButton,
    MatMiniFabButton
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {

}

