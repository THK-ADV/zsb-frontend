import {KeycloakService} from 'keycloak-angular'
import {environment} from '../../environments/environment'

export function keycloakInitializer(keycloak: KeycloakService): () => Promise<any> {
  return (): Promise<any> => {
    return keycloak.init({
      config: {
        url: environment.keycloak.authUrl,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId,
      },
      initOptions: {
        onLoad: 'login-required',
        // onLoad: 'check-sso',
        checkLoginIframe: false
      },
      enableBearerInterceptor: true
    })
  }
}
