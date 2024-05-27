import { Component } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {WorkspaceData} from "../home.store";

@Component({
  selector: 'app-add-workspace-dialog',
  standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle,
        MatFormField,
        MatInput,
        ReactiveFormsModule
    ],
  templateUrl: './add-workspace-dialog.component.html',
  styleUrl: './add-workspace-dialog.component.css'
})
export class AddWorkspaceDialogComponent {
  workspaceForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    description: new FormControl('', [Validators.required])
  });

  constructor(private readonly dialogRef: MatDialogRef<AddWorkspaceDialogComponent>) {
  }

  submitForm() {
    this.dialogRef.close(
      <WorkspaceData>{ name: this.workspaceForm.value.name, description: this.workspaceForm.value.description }
    );
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
