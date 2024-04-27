import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent implements AfterViewInit {
  @Input() projectName!: string;
  @Input() isEditing!: boolean;
  @Input() projectIconColor!: string;
  isBlurByControlKeys = false;
  // @Output() onCardInited = new EventEmitter<number>();
  @Output() onRemoveCard = new EventEmitter<void>();

  @ViewChild('projectNameInput') projectNameInput!: ElementRef;

  onProcessControlKeys(event: KeyboardEvent) {
    console.log(event.key)
    if (event.key === 'Enter') {
      this.isBlurByControlKeys = true
      if (this.projectName !== null && this.projectName.trim() !== "") {
        this.initCard()
      } else {
        this.onRemoveCard.emit()
      }
    } else if (event.key === 'Escape') {
      this.isBlurByControlKeys = true
      this.onRemoveCard.emit()
    }
  }

  onInputBlur() {
    console.log("blur")
    if (!this.isBlurByControlKeys) {
      this.onRemoveCard.emit()
    } else {
      this.isBlurByControlKeys = false
    }
  }

  initCard() {
    this.isEditing = false
    // this.onCardInited.emit(projectName)
  }

  ngAfterViewInit(): void {
    this.projectNameInput.nativeElement.focus()
  }
}


// container: StringContainer = new StringContainer()
// container.put("sadoifjasdoif")
// console.log(container.value) // sadoifjasdoif
// container.subscribe((str) => console.log(str))
// container.put("xnjnj")





