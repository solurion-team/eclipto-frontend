import {Injectable} from "@angular/core";
import {ComponentStore} from "@ngrx/component-store";
import {tapResponse} from "@ngrx/operators";
import {mergeMap, finalize, Observable, tap} from "rxjs";
import {CookieService} from "ngx-cookie-service";
import {LoginService} from "./login.service";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../client/api/auth.service";
import {CredentialsService} from "../data/credentials.service";

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
    private readonly authService: AuthService, private readonly credentialsService: CredentialsService,
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
      mergeMap((credentials) => this.authService.login(credentials).pipe(
        finalize(() => this.patchState({isLoading: false})),
        tapResponse(
          (response) => {
            this.credentialsService.saveCredentials(response)
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
