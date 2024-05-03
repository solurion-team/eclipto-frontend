import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  constructor(private readonly cookieService: CookieService) { }

  public isTokenValid(token: string): boolean {
    return true; // TODO add logic
  }

  public saveToken(token: string) {
    this.cookieService.set(this.ACCESS_TOKEN_KEY, token, {secure: true, sameSite: "Strict"})
  }

  public get token(): string {
   return this.cookieService.get(this.ACCESS_TOKEN_KEY)
  }

  public get authTokenHeader(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })
  }
}
