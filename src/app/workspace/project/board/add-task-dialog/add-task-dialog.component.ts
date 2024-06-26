import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import {
  MAT_DIALOG_DATA, MatDialogActions, MatDialogContent,
  MatDialogRef, MatDialogTitle
} from "@angular/material/dialog";
import {MatButton, MatMiniFabButton} from "@angular/material/button";
import { MatFormField, MatHint, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatOption, MatSelect } from "@angular/material/select";
import { Priority } from "../../../../client/model/priority";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatIcon } from "@angular/material/icon";
import { MatCard } from "@angular/material/card";
import { DatePipe, NgIf } from "@angular/common";
import { provideNativeDateAdapter } from "@angular/material/core";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatButtonToggle} from "@angular/material/button-toggle";
import {TaskService} from "../../../../client/api/task.service";

export interface TaskData {
  id?: number;
  title: string;
  description?: string | null;
  isCompleted: boolean;
  priority: Priority;
  assignedUserId?: number | null;
  taskStatusId: number;
  date?: Date;
}

export interface UpdateTaskData {
  id: number;
  title?: string | null;
  description?: string | null;
  isCompleted?: boolean | null;
  priority?: Priority | null;
  assignedUserId?: number | null;
  taskStatusId?: number | null;
  date?: Date | null;
}

export interface AddTaskDialogResult {
  update: boolean,
  taskData: TaskData | UpdateTaskData
}

@Component({
  selector: 'app-add-task-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatDatepickerModule,
    MatIcon,
    MatCard,
    DatePipe,
    NgIf,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatLabel,
    MatCheckbox,
    MatButtonToggle,
    MatMiniFabButton
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.css']
})
export class AddTaskDialogComponent implements OnInit {
  calendarVisible: boolean = false;
  readonly minDate = new Date();

  taskForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(1)]),
    description: new FormControl('', []),
    priority: new FormControl<Priority>('medium', [Validators.required]),
    date: new FormControl<Date | null>(null),
    isCompleted: new FormControl<boolean>(false)
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { taskStatusId: number, taskData?: TaskData },
    private readonly dialogRef: MatDialogRef<AddTaskDialogComponent>,
    private readonly taskService: TaskService
  ) { }

  ngOnInit(): void {
    if (this.data.taskData) {
      this.taskForm.patchValue({
        title: this.data.taskData.title,
        description: this.data.taskData.description,
        priority: this.data.taskData.priority,
        date: this.data.taskData.date,
        isCompleted: this.data.taskData.isCompleted
      });
    }
  }

  submitForm() {
    const addTaskData: TaskData = {
      title: this.taskForm.value.title!,
      description: this.taskForm.value.description!,
      isCompleted: this.taskForm.value.isCompleted!,
      priority: this.taskForm.value.priority!,
      date: this.taskForm.value.date!,
      taskStatusId: this.data.taskStatusId
    };
    if (this.data.taskData) {
      addTaskData.id = this.data.taskData.id!;
      if (addTaskData === this.data.taskData) {
        this.dialogRef.close();
        return
      }
      this.dialogRef.close(<AddTaskDialogResult>{update: true, taskData: addTaskData});
      return
    }
    this.dialogRef.close(<AddTaskDialogResult>{update: false, taskData: addTaskData});
  }

  closeDialog() {
    this.dialogRef.close();
  }

  openCalendar() {
    this.calendarVisible = true;
  }

  saveDate(date: Date | undefined | null ) {
    if (date) {
      this.taskForm.patchValue({ date: date });
      this.calendarVisible = false;
    }
  }

  generateDescription() {
    this.taskService.getTaskDescription({title: this.taskForm.value.title!}).subscribe({
      next: result => this.taskForm.patchValue({ description: result.description })
    })
  }
}

