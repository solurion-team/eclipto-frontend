import { Component } from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {RegisterStore} from "./register.store";
import {provideComponentStore} from "@ngrx/component-store";

@Component({
  selector: 'app-register',
  standalone: true,
    imports: [
        AsyncPipe,
        ReactiveFormsModule,
        RouterLink
    ],
  providers: [provideComponentStore(RegisterStore)],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(4)]),
    lastName: new FormControl('', [Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  isError$ = this.registerStore.isError$;
  isLoading$ = this.registerStore.isLoading$;

  constructor(private readonly registerStore: RegisterStore, private router: Router) {}

  ngOnInit() {
    this.registerStore.formVm$.subscribe({
      next: value => this.registerForm.patchValue(value),
    })
    this.registerStore.isRegisterCompleted$.subscribe({
      next: value => value && this.navigateToHome()
    })
  }

  onSubmit() {
    this.registerStore.register({
      firstName: this.registerForm.value.firstName!,
      lastName: this.registerForm.value.lastName!,
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!
    })
  }

  private navigateToHome() {
    this.router.navigate(["/home"]).then();
  }
}
