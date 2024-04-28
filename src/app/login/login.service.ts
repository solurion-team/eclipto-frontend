import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private cookieService: CookieService, private http: HttpClient) { }

  async login(login: string, password: string) {
    const params = new HttpParams()
      .set("client_id", "eclipto-client")
      .set("redirect_uri", encodeURI("http://localhost:4200/login/callback"))
      .set("state", await this.generateAndSaveState())
      .set("response_type", "code")
      // .set("grant_type", "authorization_code")
      .set("scope", "openid profile")
      .set("code_challenge", await this.generateAndSaveCodeChallenge())
      .set("code_challenge_method", "S256")
      .set("nonce", await this.generateAndSaveNonce())

    this.http.get(
      "http://localhost:8080/oauth2/v1/authorize", {params:params, headers:{
        "Authorization": "Basic " + btoa("user:password"),
        }}
    ).subscribe( {
      next: result => {
        console.log(result)
      },
      error: er => {
        console.error(er)
      }
    })
    // window.location.href = "http://localhost:8080/oauth2/v1/authorize?" + params.toString()
  }

  async generateAndSaveState() {
    const state = await this.base64URLEncode(crypto.getRandomValues(new Uint8Array(64)));
    this.cookieService.set('oauthState', state);
    return state;
  }

  async generateAndSaveCodeChallenge() {
    const codeVerifier = await this.base64URLEncode(crypto.getRandomValues(new Uint8Array(64)));
    this.cookieService.set('oauthCode', codeVerifier);
    return await this.sha256(codeVerifier);
  }

  async generateAndSaveNonce() {
    const nonce = await this.base64URLEncode(crypto.getRandomValues(new Uint8Array(64)));
    this.cookieService.set('oauthNonce', nonce);
    return nonce;
  }

  private async base64URLEncode(buffer: Uint8Array): Promise<string> {
    return btoa(String.fromCharCode.apply(null, buffer as unknown as number[]))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  private async sha256(input: string): Promise<string> {
    const buffer = new TextEncoder().encode(input);
    const hash = await crypto.subtle.digest('SHA-256', buffer);
    return this.base64URLEncode(new Uint8Array(hash));
  }
}
