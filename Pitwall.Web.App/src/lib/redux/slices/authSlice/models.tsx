export interface OAuthToken {
  accessToken: string;
  expires: number;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  name: string;
  email: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
