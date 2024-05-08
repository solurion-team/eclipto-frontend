import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  constructor(private readonly cookieService: CookieService) { }

  public isTokenExists(): boolean {
    return this.cookieService.check(this.ACCESS_TOKEN_KEY); // TODO add logic
  }

  public saveToken(token: string) {
    this.cookieService.set(this.ACCESS_TOKEN_KEY, token, {secure: true, sameSite: "Strict"})
  }

  public get token(): string {
   return this.cookieService.get(this.ACCESS_TOKEN_KEY)
  }
}
