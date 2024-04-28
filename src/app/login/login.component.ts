import {Component} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isError = false;

  onNextClick() {
    this.isError = !this.isError;
  }
}
