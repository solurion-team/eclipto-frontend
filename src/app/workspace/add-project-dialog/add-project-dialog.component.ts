import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-add-project-dialog',
  standalone: true,
  imports: [],
  templateUrl: './add-project-dialog.component.html',
  styleUrl: './add-project-dialog.component.css'
})
export class AddProjectDialogComponent {

  @ViewChild('modal') modal!: ElementRef;

  openModal() {
    this.modal.nativeElement.showModal();
    this.modal.nativeElement.style.display = 'block';
  }
}
