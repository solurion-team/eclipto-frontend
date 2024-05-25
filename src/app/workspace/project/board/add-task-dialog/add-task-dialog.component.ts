import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import {
  MAT_DIALOG_DATA, MatDialogActions, MatDialogContent,
  MatDialogRef, MatDialogTitle
} from "@angular/material/dialog";
import { MatButton } from "@angular/material/button";
import { MatFormField, MatHint, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatOption, MatSelect } from "@angular/material/select";
import { Priority } from "../../../../client/model/priority";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatIcon } from "@angular/material/icon";
import { MatCard } from "@angular/material/card";
import { DatePipe, NgIf } from "@angular/common";
import { provideNativeDateAdapter } from "@angular/material/core";

export interface AddTaskData {
  title: string;
  description: string;
  priority: Priority;
  assignedUserId?: number;
  taskStatusId: number;
  date: Date;
}

export interface EditTaskData {
  task: {
    id: number;
    title: string;
    description: string;
    priority: Priority;
    date: Date;
    taskStatusId: number;
  }
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
    MatLabel
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.css']
})
export class AddTaskDialogComponent implements OnInit {
  selectedDate: Date | null = null;
  calendarVisible: boolean = false;

  taskForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(1)]),
    description: new FormControl('', []),
    priority: new FormControl<Priority>('medium', [Validators.required]),
    date: new FormControl<Date | null>(null, [Validators.required])
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { taskStatusId?: number, task?: { id: number, title: string, description: string, priority: Priority, date: Date, taskStatusId: number } },
    private readonly dialogRef: MatDialogRef<AddTaskDialogComponent>
  ) { }

  ngOnInit(): void {
    if (this.data.task) {
      this.taskForm.patchValue({
        title: this.data.task.title,
        description: this.data.task.description,
        priority: this.data.task.priority,
        date: this.data.task.date
      });
    }
  }

  submitForm() {
    if (this.data.task) {
      // Editing existing task
      const editTaskData: EditTaskData = {
        task: {
          id: this.data.task.id,
          title: this.taskForm.value.title!,
          description: this.taskForm.value.description!,
          priority: this.taskForm.value.priority!,
          date: this.taskForm.value.date!,
          taskStatusId: this.data.task.taskStatusId
        }
      };
      this.dialogRef.close(editTaskData);
    } else {
      // Creating new task
      const addTaskData: AddTaskData = {
        title: this.taskForm.value.title!,
        description: this.taskForm.value.description!,
        priority: this.taskForm.value.priority!,
        date: this.taskForm.value.date!,
        taskStatusId: this.data.taskStatusId!
      };
      this.dialogRef.close(addTaskData);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  openCalendar() {
    this.calendarVisible = true;
  }

  saveDate() {
    if (this.selectedDate) {
      this.taskForm.patchValue({ date: this.selectedDate });
      this.calendarVisible = false;
    }
  }
}

