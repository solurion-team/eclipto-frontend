import { Component } from '@angular/core';
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatButtonToggle} from "@angular/material/button-toggle";
// import {
//   CdkDragDrop,
//   moveItemInArray,
//   transferArrayItem,
//   CdkDrag,
//   CdkDropList,
// } from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    MatCardContent,
    MatCard,
    MatButtonToggle
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {

}
