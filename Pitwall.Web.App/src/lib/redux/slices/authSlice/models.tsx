export interface OAuthToken {
  accessToken: string;
  expires: number;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  name: string;
  PitBoxSessionId: string;
}

export interface User {
  name: string;
  email: string;
  pitBoxSessionId: string;
}
