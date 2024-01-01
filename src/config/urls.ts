export const BASE_URL = process.env.BASE_URL
export const API_BASE_URL = (process.env.APP_ENV != 'development-localserver') ? BASE_URL + '/api' : BASE_URL
export const API_V1_URL = API_BASE_URL + '/v1.0'
export const API_V2_URL = API_BASE_URL + '/v2.0'