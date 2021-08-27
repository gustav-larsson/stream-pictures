import { TwitchAuthenticationService } from "../services/twitch.authentication.service";

export function appInitializer(twitchAuthenticationService: TwitchAuthenticationService) {
  return () => new Promise(resolve => {
    // attempt to refresh token on app start up to auto authenticate
    twitchAuthenticationService.refreshToken()
    .subscribe()
    .add(resolve);
  });
}
