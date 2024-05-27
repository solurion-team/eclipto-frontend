import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {JwtAuthenticationResponse} from "../client/model/jwtAuthenticationResponse";

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly USER_ID_KEY = 'user_id';
  constructor(private readonly cookieService: CookieService) { }

  public isTokenExists(): boolean {
    return this.cookieService.check(this.ACCESS_TOKEN_KEY); // TODO add logic
  }

  public saveToken(token: string) {
    this.cookieService.set(this.ACCESS_TOKEN_KEY, token, {path: "/", secure: true, sameSite: "Strict"})
  }

  public saveUserId(userId: number) {
    this.cookieService.set(this.USER_ID_KEY, String(userId), {secure: true, sameSite: "Strict"})
  }

  public saveCredentials(authResponse: JwtAuthenticationResponse) {
    this.saveToken(authResponse.access_token)
    this.saveUserId(this.claims.userId)
  }

  public get token(): string {
    return this.cookieService.get(this.ACCESS_TOKEN_KEY)
  }

  public get isAuthenticated(): boolean {
    return this.isTokenExists() && this.isTokenValid()
  }

  private isTokenValid(): boolean {
    return true; //TODO
  }

  public get userId(): number {
    return Number(this.cookieService.get(this.USER_ID_KEY))
  }

  public get claims(): any {
    return JSON.parse(atob(this.token.split('.')[1]))
  }
}
