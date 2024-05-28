import {Component, OnInit} from '@angular/core';
import {provideComponentStore} from "@ngrx/component-store";
import {BoardStore, TaskCard, TaskFilter, TaskStatusContainer} from "./board.store";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatButton, MatFabButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatButtonToggle} from "@angular/material/button-toggle";
import {MatCard, MatCardContent} from "@angular/material/card";
import {
  AddTaskDialogComponent,
  AddTaskDialogResult,
  TaskData,
  UpdateTaskData
} from "./add-task-dialog/add-task-dialog.component";
import {AddTaskStatusDialogComponent} from "./add-task-status-dialog/add-task-status-dialog.component";
import {ProjectCardComponent} from "../../sidebar/project-card/project-card.component";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {provideNativeDateAdapter} from "@angular/material/core";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
  moveItemInArray,
  transferArrayItem
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
  ) {
  }

  ngOnInit(): void {
    this.boardStore.taskDataLoadedEvent$.subscribe({
      next: (data) => this.openAddTaskDialog(data.taskStatusId, data)
    })
    this.boardStore.loadBoard(TaskFilter.All)
  }

  openAddTaskDialog(taskStatusId: number, taskData?: TaskData) {
    this.addTaskDialogRef = this.dialog.open(AddTaskDialogComponent, {
      height: '550px',
      width: '1000px',
      data: {taskStatusId: taskStatusId, taskData: taskData}
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
    console.log("sss" + id)
    this.boardStore.loadTaskData(id)
  }

  deleteTask(taskStatusId: number, taskId: number) {
    this.boardStore.deleteTask({taskStatusId, taskId})
  }

  filterTasks(taskFilter: TaskFilter) {
    this.boardStore.loadBoard(taskFilter)
  }

  getTransparentTint(tint: string): string {
    const alpha = 0.1;

    if (tint.startsWith('#')) {
      const r = parseInt(tint.slice(1, 3), 16);
      const g = parseInt(tint.slice(3, 5), 16);
      const b = parseInt(tint.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return tint;
  }

  protected readonly TaskFilter = TaskFilter;
}
