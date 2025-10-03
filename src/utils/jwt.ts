import jwt from "jsonwebtoken";

export function signJwt(payload: object, secretKey: string, expiresIn: object) {
  return jwt.sign(
      payload,
      secretKey,
      expiresIn
    )
}