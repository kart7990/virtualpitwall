export interface OAuthToken {
    accessToken: string,
    expires: number
    refreshToken: string
}

export interface JwtPayload {
    sub: string,
    name: string
}

export interface User {
    name: string,
    email: string
}