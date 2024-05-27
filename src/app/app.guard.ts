import {inject} from "@angular/core";
import {CredentialsService} from "./data/credentials.service";
import {UrlSerializer} from "@angular/router";

export const authenticatedGuard = () => {
  const credentialsService = inject(CredentialsService);
  if (!credentialsService.isAuthenticated) {
    const urlSerializer = inject(UrlSerializer)
    return urlSerializer.parse("/login")
  }
  return true
};
