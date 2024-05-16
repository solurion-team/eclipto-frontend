import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatButtonToggle} from "@angular/material/button-toggle";

export interface ProjectCardState {
  readonly id: number,
  readonly name: string,
  readonly iconColor: string,
  readonly isSelected: boolean,
}

export interface ProjectCreatedEvent {
  projectName: string
}

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [
    FormsModule,
    MatCard,
    MatIcon,
    MatCardContent,
    MatButtonToggle
  ],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {
  @Input() state!: ProjectCardState
  @Output() onOpenProject = new EventEmitter<void>();

  onCardClick() {
    this.onOpenProject.emit()
  }
}






