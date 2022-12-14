import jwt_decode from 'jwt-decode';

export async function responseHeadersAuth(response) {
  let accessToken;
  let refreshToken;
  try {
    accessToken = response.body.accessToken;
    const [rt] = response.headers['set-cookie'];
    refreshToken = rt.split(';')[0];
  } catch (error) {
    return {
      accessToken,
      refreshToken,
    };
  }
  return {
    accessToken,
    refreshToken,
  };
}

export function decodeToken(token: string) {
  return jwt_decode(token);
}
