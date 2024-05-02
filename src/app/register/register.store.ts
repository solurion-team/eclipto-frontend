import {Injectable} from "@angular/core";
import {ComponentStore} from "@ngrx/component-store";
import {CookieService} from "ngx-cookie-service";
import {exhaustMap, finalize, Observable, tap} from "rxjs";
import {tapResponse} from "@ngrx/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {RegisterService} from "./register.service";

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
    private readonly registerService: RegisterService,
    private readonly cookieService: CookieService
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
      exhaustMap((userData) => this.registerService.register(
        {first_name: userData.firstName, last_name: userData.lastName, ...userData}
      ).pipe(
        finalize(() => this.patchState({isLoading: false})),
        tapResponse(
          (response) => {
            this.cookieService.set("access_token", response.access_token, {secure: true, sameSite: "Strict"})
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
