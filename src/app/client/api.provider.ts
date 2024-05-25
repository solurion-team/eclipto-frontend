import {Configuration, ConfigurationParameters} from "./configuration";
import {EnvironmentProviders, inject, Injector, makeEnvironmentProviders} from "@angular/core";
import {CredentialsService} from "../data/credentials.service";

export function withApiConfiguration(configurationParameters: ConfigurationParameters = {}): Configuration {
  return new Configuration({
    basePath: 'http://localhost:8000',
    ...configurationParameters,
  });
}

export function withCredentials(): {[key: string]: string | (() => string | undefined)} {
  const injector = Injector.create({
    providers: [
      { provide: CredentialsService, deps: [] }
    ]
  });
  const credentialsService = injector.get(CredentialsService);

  return {
    bearerHttpAuthentication: () => credentialsService.token
  };
}

export function provideApi(withConfiguration: Configuration = withApiConfiguration()): EnvironmentProviders {
  return makeEnvironmentProviders([
    {provide: Configuration, useValue: withConfiguration},
  ]);
}
