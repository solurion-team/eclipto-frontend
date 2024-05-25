import {Component, OnInit} from '@angular/core';
import {provideComponentStore} from "@ngrx/component-store";
import {ProjectStore} from "../project.store";
import {BoardStore} from "./board.store";
import {WorkspaceStore} from "../../workspace.store";
import {ActivatedRoute, Router} from "@angular/router";
import {AddProjectDialogComponent} from "../../add-project-dialog/add-project-dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatButton, MatFabButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatButtonToggle} from "@angular/material/button-toggle";
import {MatCard, MatCardContent} from "@angular/material/card";
import {AddTaskDialogComponent} from "./add-task-dialog/add-task-dialog.component";
import {AddTaskStatusDialogComponent} from "./add-task-status-dialog/add-task-status-dialog.component";
import {ProjectCardComponent} from "../../sidebar/project-card/project-card.component";
import {AsyncPipe} from "@angular/common";
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
    MatMiniFabButton,
    ProjectCardComponent,
    AsyncPipe
  ],
  providers: [provideComponentStore(BoardStore)],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent implements OnInit {
  readonly taskStatuses$ = this.boardStore.taskStatuses$;
  readonly isLoading$ = this.boardStore.isLoading$;

  private addTaskDialogRef?: MatDialogRef<AddTaskDialogComponent>
  private addTaskStatusDialogRef?: MatDialogRef<AddTaskStatusDialogComponent>

  constructor(
    private readonly boardStore: BoardStore,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.boardStore.loadBoard()
  }

  openAddTaskDialog(taskStatusId: number) {
    this.addTaskDialogRef = this.dialog.open(AddTaskDialogComponent, {
      height: '400px',
      width: '600px',
      data: { taskStatusId: taskStatusId }
    });
    this.addTaskDialogRef.afterClosed().subscribe(result => result && this.boardStore.addTask(result))
  }

  openAddTaskStatusDialog() {
    this.addTaskStatusDialogRef = this.dialog.open(AddTaskStatusDialogComponent, {
      height: '400px',
      width: '600px',
    });
    this.addTaskStatusDialogRef.afterClosed().subscribe(result => result && this.boardStore.addTaskStatus(result))
  }
}
