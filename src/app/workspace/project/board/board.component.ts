import { Component, OnInit } from '@angular/core';
import { provideComponentStore } from "@ngrx/component-store";
import { ProjectStore } from "../project.store";
import {BoardStore, TaskCard, TaskStatusContainer} from "./board.store";
import { WorkspaceStore } from "../../workspace.store";
import { ActivatedRoute, Router } from "@angular/router";
import { AddProjectDialogComponent } from "../../add-project-dialog/add-project-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatButton, MatFabButton, MatIconButton, MatMiniFabButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatButtonToggle } from "@angular/material/button-toggle";
import { MatCard, MatCardContent } from "@angular/material/card";
import {
  AddTaskDialogComponent,
  AddTaskDialogResult,
  TaskData,
  UpdateTaskData
} from "./add-task-dialog/add-task-dialog.component";
import { AddTaskStatusDialogComponent } from "./add-task-status-dialog/add-task-status-dialog.component";
import { ProjectCardComponent } from "../../sidebar/project-card/project-card.component";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from "@angular/material/datepicker";
import { MatFormField, MatHint, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList
} from '@angular/cdk/drag-drop';
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";

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
    AsyncPipe,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatHint,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    DragDropModule,
    NgForOf,
    NgIf,
    MatRadioButton,
    MatRadioGroup,
    NgClass
  ],
  providers: [provideComponentStore(BoardStore), provideNativeDateAdapter()],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
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
    this.boardStore.taskDataLoadedEvent$.subscribe({
      next: (data) => this.openAddTaskDialog(data.taskStatusId, data)
    })
    this.boardStore.loadBoard()
  }

  openAddTaskDialog(taskStatusId: number, taskData?: TaskData) {
    this.addTaskDialogRef = this.dialog.open(AddTaskDialogComponent, {
      height: '600px',
      width: '1000px',
      data: { taskStatusId: taskStatusId, taskData: taskData }
    });
    this.addTaskDialogRef.afterClosed().subscribe((result: AddTaskDialogResult) => {
      if (result && result.update) {
        this.boardStore.updateTask(result.taskData as UpdateTaskData)
      } else if (result) {
        this.boardStore.addTask(result.taskData as TaskData)
      }
    })
  }

  openAddTaskStatusDialog() {
    this.addTaskStatusDialogRef = this.dialog.open(AddTaskStatusDialogComponent, {
      height: '400px',
      width: '600px',
    });
    this.addTaskStatusDialogRef.afterClosed().subscribe(result => result && this.boardStore.addTaskStatus(result))
  }

  drop(event: CdkDragDrop<any[]>, taskStatus: TaskStatusContainer) {
    if (event.previousContainer === event.container) {
      moveItemInArray(taskStatus.tasks, event.previousIndex, event.currentIndex);
    } else {
      this.boardStore.updateTask({id: event.item.data.id, taskStatusId: taskStatus.id})
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  sortPredicate(index: number, _: CdkDrag<TaskCard>, drop: CdkDropList<TaskCard[]>): boolean {
    return index === drop.data.length;
  }

  editTask(id: number) {
    this.boardStore.loadTaskData(id)
  }

  deleteTask(taskStatusId: number, taskId: number) {
    this.boardStore.deleteTask({taskStatusId, taskId})
  }

  filterTasks(completed: string) {
    return
  }
}











//
// import { Component, OnInit } from '@angular/core';
// import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatIcon } from '@angular/material/icon';
// import { MatIconButton } from '@angular/material/button';
// import { MatCard, MatCardContent } from '@angular/material/card';
// import { MatButton, MatFabButton, MatMiniFabButton } from '@angular/material/button';
// import { AsyncPipe, NgIf } from '@angular/common';
// import { provideComponentStore } from '@ngrx/component-store';
// import { BoardStore } from './board.store';
// import { AddTaskDialogComponent, AddTaskData } from './add-task-dialog/add-task-dialog.component';
// import { AddTaskStatusDialogComponent } from './add-task-status-dialog/add-task-status-dialog.component';
// import { TaskStatusContainer, TaskCard } from './board.store';
//
// @Component({
//   selector: 'app-board',
//   standalone: true,
//   imports: [
//     MatCardContent,
//     MatCard,
//     MatButton,
//     MatIcon,
//     MatFabButton,
//     MatIconButton,
//     MatMiniFabButton,
//     MatMenuModule,
//     AsyncPipe,
//     NgIf
//   ],
//   providers: [provideComponentStore(BoardStore)],
//   templateUrl: './board.component.html',
//   styleUrls: ['./board.component.css']
// })
// export class BoardComponent implements OnInit {
//   readonly taskStatuses$ = this.boardStore.taskStatuses$;
//   readonly isLoading$ = this.boardStore.isLoading$;
//
//   private addTaskDialogRef?: MatDialogRef<AddTaskDialogComponent>;
//   private addTaskStatusDialogRef?: MatDialogRef<AddTaskStatusDialogComponent>;
//
//   constructor(
//     private readonly boardStore: BoardStore,
//     private readonly dialog: MatDialog
//   ) {}
//
//   ngOnInit(): void {
//     this.boardStore.loadBoard();
//   }
//
//   openAddTaskDialog(taskStatusId: number): void {
//     this.addTaskDialogRef = this.dialog.open(AddTaskDialogComponent, {
//       height: '600px',
//       width: '1000px',
//       data: { taskStatusId: taskStatusId }
//     });
//     this.addTaskDialogRef.afterClosed().subscribe(result => result && this.boardStore.addTask(result));
//   }
//
//   openEditTaskDialog(task: TaskCard): void {
//     this.addTaskDialogRef = this.dialog.open(AddTaskDialogComponent, {
//       height: '600px',
//       width: '1000px',
//       data: { ...task }
//     });
//     this.addTaskDialogRef.afterClosed().subscribe(result => result && this.boardStore.updateTask(result));
//   }
//
//   openAddTaskStatusDialog(): void {
//     this.addTaskStatusDialogRef = this.dialog.open(AddTaskStatusDialogComponent, {
//       height: '400px',
//       width: '600px'
//     });
//     this.addTaskStatusDialogRef.afterClosed().subscribe(result => result && this.boardStore.addTaskStatus(result));
//   }
//
//   deleteTask(taskId: number): void {
//     this.boardStore.deleteTask(taskId);
//   }
//
//   trackByTaskStatusId(index: number, taskStatus: TaskStatusContainer): number {
//     return taskStatus.id;
//   }
//
//   trackByTaskId(index: number, task: TaskCard): number {
//     return task.id;
//   }
// }
