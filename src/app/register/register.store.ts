import {Injectable} from "@angular/core";
import {ComponentStore} from "@ngrx/component-store";
import {CookieService} from "ngx-cookie-service";
import {mergeMap, finalize, Observable, tap} from "rxjs";
import {tapResponse} from "@ngrx/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {RegisterService} from "./register.service";
import {AuthService} from "../client/api/auth.service";
import {CredentialsService} from "../data/credentials.service";

export interface RegisterState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isLoading: boolean,
  isError: boolean,
  isRegisterCompleted: boolean
}

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const initialState: RegisterState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  isLoading: false,
  isError: false,
  isRegisterCompleted: false
}

@Injectable()
export class RegisterStore extends ComponentStore<RegisterState>{
  constructor(
    private readonly authService: AuthService, private readonly credentialsService: CredentialsService
  ) {
    super(initialState);
  }

  readonly firstName$ = this.select(state => state.firstName);
  readonly lastName$ = this.select(state => state.lastName);
  readonly email$ = this.select(state => state.email);
  readonly password$ = this.select(state => state.password);
  readonly formVm$ = this.select({
    firstName: this.firstName$,
    lastName: this.lastName$,
    email: this.email$,
    password: this.password$,
  })

  readonly isLoading$ = this.select(state => state.isLoading);
  readonly isError$ = this.select(state => state.isError);
  readonly isRegisterCompleted$ = this.select(state => state.isRegisterCompleted);

  readonly register = this.effect((userData$: Observable<UserData>) => {
    return userData$.pipe(
      tap((userData) => this.patchState({...userData, isLoading: true, isError: false})),
      mergeMap((userData) => this.authService.register(
        {first_name: userData.firstName, last_name: userData.lastName, email: userData.email, password: userData.password}
      ).pipe(
        finalize(() => this.patchState({isLoading: false})),
        tapResponse(
          (response) => {
            this.credentialsService.saveCredentials(response)
            this.patchState({isRegisterCompleted: true})
          },
          (error: HttpErrorResponse) => {
            this.patchState({password: "", isError: true})
          }
        ),
      )),
    );
  });
}
