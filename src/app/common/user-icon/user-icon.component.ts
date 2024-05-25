import { Component } from '@angular/core';

export interface UserIconState {
  readonly initials: string,
  readonly iconTint: string,
}

@Component({
  selector: 'app-user-icon',
  standalone: true,
  imports: [],
  templateUrl: './user-icon.component.html',
  styleUrl: './user-icon.component.css'
})
export class UserIconComponent {

}
