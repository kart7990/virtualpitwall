export interface ExternalLoginData {
  provider: string;
  token: string;
}

export interface OAuthProviderData extends ExternalLoginData {
  email: string;
  name: string;
}

export interface ExternalRegisterData extends OAuthProviderData {
  iRacingCustomerId: string;
}
