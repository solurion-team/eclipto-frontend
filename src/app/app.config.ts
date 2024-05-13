import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient} from "@angular/common/http";
import {provideAnimations} from "@angular/platform-browser/animations";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideApi, withApiConfiguration, withCredentials} from "./client/api.provider";
import {environment} from "../environments/environment";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideApi(
      withApiConfiguration({
        basePath: environment.apiUrl,
        withCredentials: true
      }),
    ),
    provideHttpClient(),
    provideAnimations(),
    provideAnimationsAsync()
  ]
};
