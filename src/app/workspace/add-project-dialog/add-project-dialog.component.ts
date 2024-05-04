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



import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
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
    MatDialogActions
  ],
  styleUrls: ['./add-project-dialog.component.css'],
  providers: [
    { provide: MatDialogRef, useValue: AddProjectDialogComponent } // Предоставляем пустой объект в качестве MatDialogRef
  ]
})

export class AddProjectDialogComponent {
  projectForm: FormGroup;
  showForm: boolean = false;

  constructor(private formBuilder: FormBuilder, private dialog: MatDialog) {
    this.projectForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  closeModal() {
    this.dialog.closeAll(); // Закрыть все открытые диалоговые окна
  }

  submitForm() {
    if (this.projectForm.valid) {
      console.log('Form submitted:', this.projectForm.value);
      this.projectForm.reset();
      this.showForm = false;
      this.dialog.closeAll(); // Закрыть все открытые диалоговые окна после успешной отправки формы
    } else {
      console.error('Form is invalid.');
    }
  }
}







