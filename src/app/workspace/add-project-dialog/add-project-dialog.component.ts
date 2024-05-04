import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {WorkspaceStore} from "../workspace.store";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-project-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-project-dialog.component.html',
  styleUrl: './add-project-dialog.component.css'
})
export class AddProjectDialogComponent implements OnInit {
  @ViewChild('modal') modal!: ElementRef;
  projectForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    description: new FormControl('', [Validators.required])
  });

  constructor(private readonly workspaceStore: WorkspaceStore) {
  }

  ngOnInit(): void {
    this.modal.nativeElement.style.display = 'block';
    this.workspaceStore.isAddProjectDialogActive$.subscribe({
      next: value => {
        if (value) this.openModal()
        else this.closeModal()
      }
    })
  }

  openModal() {
    this.modal.nativeElement.showModal();
  }

  closeModal() {
    this.modal.nativeElement.close();
  }

  onSubmit() {
    this.workspaceStore.createProject({
      name: this.projectForm.value.name!,
      description: this.projectForm.value.description!
    })
  }

  onCloseDialog() {
    this.workspaceStore.setIsAddNewProjectDialogActive(false)
  }
}
