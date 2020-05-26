import jwt from "jsonwebtoken";
import config from "config";

export function generateToken(user) {
  const token = jwt.sign(
    { infPerId: user.infPerId, isAdmin: user.isAdmin },
    config.get("jwttoken"),
  );
  return token;
}
