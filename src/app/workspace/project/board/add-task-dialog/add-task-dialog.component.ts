import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {AddProjectDialogComponent} from "../../../add-project-dialog/add-project-dialog.component";
import {MatOption, MatSelect} from "@angular/material/select";
import {Priority} from "../../../../client/model/priority";
import {MatDatepickerToggle} from "@angular/material/datepicker";


export interface AddTaskData {
  title: string
  description: string
  priority: Priority
  assignedUserId?: number
  taskStatusId: number
}

@Component({
  selector: 'app-add-task-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatDialogTitle,
    MatLabel,
    MatDatepickerToggle,
  ],
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.css'
})
export class AddTaskDialogComponent {
  taskForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(1)]),
    description: new FormControl('', []),
    priority: new FormControl<Priority>('medium', [Validators.required]),
    // date: new FormControl('', [])
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {taskStatusId: number},
    private readonly dialogRef: MatDialogRef<AddProjectDialogComponent>
  ) {
  }

  submitForm() {
    const data: AddTaskData = {
      title: this.taskForm.value.title!,
      description: this.taskForm.value.description!,
      priority: this.taskForm.value.priority!,
      // date: this.taskForm.value.date,
      taskStatusId: this.data.taskStatusId
    }
    this.dialogRef.close(data);
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
