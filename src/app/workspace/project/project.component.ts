import { Component, Input } from '@angular/core';
import { BoardComponent } from './board/board.component'

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [ BoardComponent ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent {
  @Input() isActiveSidebar: boolean = false;
}
