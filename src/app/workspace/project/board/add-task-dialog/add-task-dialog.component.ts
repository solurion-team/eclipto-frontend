import { Component } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {AddProjectDialogComponent} from "../../../add-project-dialog/add-project-dialog.component";
import {MatOption, MatSelect} from "@angular/material/select";

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
    MatLabel
  ],
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.css'
})
export class AddTaskDialogComponent {
  projectForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    description: new FormControl('', [Validators.required])
  });

  constructor(private readonly dialogRef: MatDialogRef<AddProjectDialogComponent>) {
  }

  submitForm() {
    this.dialogRef.close(
      { name: this.projectForm.value.name, description: this.projectForm.value.description }
    );
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
