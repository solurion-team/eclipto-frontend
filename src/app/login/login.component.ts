import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {ComponentStore, provideComponentStore} from "@ngrx/component-store";
import {LoginState, LoginStore} from "./login.store";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatButtonToggle} from "@angular/material/button-toggle";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgClass, FormsModule, ReactiveFormsModule, AsyncPipe, RouterLink, HttpClientModule, MatFormField, MatInput, MatButton, MatButtonToggle, NgIf, MatLabel],
  providers: [provideComponentStore(LoginStore)],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });
  isError$ = this.loginStore.isError$;
  isLoading$ = this.loginStore.isLoading$;

  constructor(private readonly loginStore: LoginStore, private router: Router) {}

  ngOnInit() {
    this.loginStore.formVm$.subscribe({
      next: value => this.loginForm.patchValue(value)
    })
    this.loginStore.isLoginCompleted$.subscribe({
      next: value => value && this.navigateToHome()
    })
  }

  onSubmit() {
    this.loginStore.login({
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    })
  }

  private navigateToHome() {
    this.router.navigate(["/home"]).then();
  }
}


 // loginForm = new FormGroup({
 //    email: new FormControl('', [Validators.required, Validators.minLength(4)]),
 //    password: new FormControl('', [Validators.required, Validators.minLength(8)])
 //  });
//
//   constructor(private router: Router, private loginService: LoginService) {
//   }
//
//   onLogin() {
//     from(this.loginService.login(
//       this.loginForm.value.email as string,
//       this.loginForm.value.password as string,
//     )).subscribe( {
//       next: result => {
//         console.log(result)
//       },
//       error: er => {
//         console.error(er)
//       }
//     })
//   }
