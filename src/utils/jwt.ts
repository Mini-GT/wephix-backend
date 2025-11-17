import jwt from 'jsonwebtoken';

export function signJwt(payload: object, secretKey: string, expiresIn: object) {
  return jwt.sign(payload, secretKey, expiresIn);
}

export function verifyJwt(token: string, secretKey: string) {
  return jwt.verify(token, secretKey);
}

export function isTokenExpired(exp: number) {
  try {
    const currentTime = Date.now() / 1000;

    return exp < currentTime;
  } catch (error) {
    return true;
  }
}
