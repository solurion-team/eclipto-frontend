import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {TokenService} from "./token.service";
import {Observable} from "rxjs";
import {LoginResponse} from "../login/login.service";
import {environment} from "../../environments/environment";
import {tapResponse} from "@ngrx/operators";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  public login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/v1/login`, request).pipe(this.authResponse)
  }

  public register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/v1/register`, request).pipe(this.authResponse)
  }

  private get authResponse(): (source$: Observable<AuthResponse>) => Observable<AuthResponse> {
    return tapResponse<AuthResponse, HttpErrorResponse>(
      (response) => {
        this.tokenService.saveToken(response.access_token)
      }, (_: HttpErrorResponse) => {}
    )
  }

  public get isAuthenticated(): boolean {
    return this.tokenService.isTokenExists() && this.isTokenValid()
  }

  private isTokenValid(): boolean {
    return true;
  }

  public get authHeader(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.tokenService.token}`
    })
  }
}
