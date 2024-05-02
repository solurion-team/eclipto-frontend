import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {LoginRequest} from "../login/login.service";

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private readonly http: HttpClient) { }

  public register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(" http://127.0.0.1:8000/v1/register", request)
  }
}
