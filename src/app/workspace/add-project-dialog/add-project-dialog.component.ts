// import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
// import {WorkspaceStore} from "../workspace.store";
// import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
// import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
// import {MatButton} from "@angular/material/button";
// import {MatFormField} from "@angular/material/form-field";
// import {MatInput} from "@angular/material/input";
//
// @Component({
//   selector: 'app-add-project-dialog',
//   standalone: true,
//   imports: [
//     FormsModule,
//     ReactiveFormsModule,
//     MatDialogActions,
//     MatDialogContent,
//     MatDialogClose,
//     MatDialogTitle,
//     MatButton,
//     MatFormField,
//     MatInput
//   ],
//   templateUrl: './add-project-dialog.component.html',
//   styleUrl: './add-project-dialog.component.css'
// })
// export class AddProjectDialogComponent implements OnInit {
//   @ViewChild('modal') modal!: ElementRef;
//   projectForm = new FormGroup({
//     name: new FormControl('', [Validators.required, Validators.minLength(1)]),
//     description: new FormControl('', [Validators.required])
//   });
//
//   constructor(private readonly workspaceStore: WorkspaceStore) {
//   }
//
//   ngOnInit(): void {
//     this.modal.nativeElement.style.display = 'block';
//     this.workspaceStore.isAddProjectDialogActive$.subscribe({
//       next: value => {
//         if (value) this.openModal()
//         else this.closeModal()
//       }
//     })
//   }
//
//   openModal() {
//     this.modal.nativeElement.showModal();
//   }
//
//   closeModal() {
//     this.modal.nativeElement.close();
//   }
//
//   onSubmit() {
//     this.workspaceStore.createProject({
//       name: this.projectForm.value.name!,
//       description: this.projectForm.value.description!
//     })
//   }
//
//   onCloseDialog() {
//     this.workspaceStore.setIsAddNewProjectDialogActive(false)
//   }
// }



import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-project-dialog',
  templateUrl: './add-project-dialog.component.html',
  standalone: true,
  styleUrls: ['./add-project-dialog.component.css']
})
export class AddProjectDialogComponent implements OnInit {
  projectForm: FormGroup | undefined;

  constructor(
    private dialogRef: MatDialogRef<AddProjectDialogComponent>,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  submitForm(): void {
    if (this.projectForm.valid) {
      // Do something with the form data, like submitting it to a service
      // For example: this.projectService.addProject(this.projectForm.value);
      this.dialogRef.close();
    } else {
      // Handle form validation errors
    }
  }
}







