import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-add-project-dialog',
  templateUrl: './add-project-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogContent,
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle
  ],
  styleUrls: ['./add-project-dialog.component.css']
})

export class AddProjectDialogComponent {
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







