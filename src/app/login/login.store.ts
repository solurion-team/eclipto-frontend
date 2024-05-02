import {Injectable} from "@angular/core";
import {ComponentStore} from "@ngrx/component-store";
import {tapResponse} from "@ngrx/operators";
import {exhaustMap, finalize, Observable, tap} from "rxjs";
import {CookieService} from "ngx-cookie-service";
import {LoginService} from "./login.service";
import {HttpErrorResponse} from "@angular/common/http";

export interface LoginState {
  email: string;
  password: string;
  isLoading: boolean,
  isError: boolean,
  isLoginCompleted: boolean
}

const initialState: LoginState = {
  email: "",
  password: "",
  isLoading: false,
  isError: false,
  isLoginCompleted: false
}

@Injectable()
export class LoginStore extends ComponentStore<LoginState>{
  constructor(
    private readonly loginService: LoginService,
    private readonly cookieService: CookieService
  ) {
    super(initialState);
  }

  readonly email$ = this.select(state => state.email);
  readonly password$ = this.select(state => state.password);
  readonly formVm$ = this.select({
    email: this.email$,
    password: this.password$,
  })

  readonly isLoading$ = this.select(state => state.isLoading);
  readonly isError$ = this.select(state => state.isError);
  readonly isLoginCompleted$ = this.select(state => state.isLoginCompleted);

  readonly login = this.effect((credentials$: Observable<{email: string, password: string}>) => {
    return credentials$.pipe(
      tap((credentials) => this.patchState({...credentials, isLoading: true, isError: false})),
      exhaustMap((credentials) => this.loginService.login(credentials).pipe(
        finalize(() => this.patchState({isLoading: false})),
        tapResponse(
          (response) => {
            this.cookieService.set("access_token", response.access_token, {secure: true, sameSite: "Strict"})
            this.patchState({isLoginCompleted: true})
          },
          (error: HttpErrorResponse) => {
            this.patchState({password: "", isError: true})
          }
        ),
      )),
    );
  });
}
