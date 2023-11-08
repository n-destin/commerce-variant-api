import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { authenticate, verifyToken } from "../helpers/auth";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { appConfig } from "../config/app";

export const initAuthStategies = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: appConfig.googleCLientId,
        clientSecret: appConfig.googleCLientSecret,
        callbackURL: "/api/auth/google/redirect",
        state: false,
      },
      (accessToken, refreshToken, profile, cb) => authenticate(profile, cb),
    ),
  );

  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: appConfig.jwtKey,
      },
      async (payload, cb) => {
        try {
          await verifyToken(payload, cb);
        } catch (error) {
          return cb(false);
        }
      },
    ),
  );
};
