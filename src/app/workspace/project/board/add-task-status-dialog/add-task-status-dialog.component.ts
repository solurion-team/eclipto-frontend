import { Component } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {AddProjectDialogComponent} from "../../../add-project-dialog/add-project-dialog.component";

export interface AddTaskStatusData {
  name: string
  tint: string
}

@Component({
  selector: 'app-add-task-status-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatDialogTitle
  ],
  templateUrl: './add-task-status-dialog.component.html',
  styleUrl: './add-task-status-dialog.component.css'
})
export class AddTaskStatusDialogComponent {
  taskStatusForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
  });

  constructor(private readonly dialogRef: MatDialogRef<AddProjectDialogComponent>) {
  }

  submitForm() {
    const data: AddTaskStatusData = {
      name: this.taskStatusForm.value.name!,
      tint: "#3b62f3"
    }
    this.dialogRef.close(data);
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
