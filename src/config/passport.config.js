import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import UserRepository from "../repositories/userRepository.js";
import { createHash, isValidPassword } from "../utils/security.js";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const JWT_SECRET = process.env.JWT_SECRET;
const userRepository = new UserRepository();
const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, age } = req.body;

        try {
          let user = await userRepository.getByEmail(username);
          if (user) {
            return done(null, false, { message: "El usuario ya existe" });
          }

          const newUser = {
            first_name,
            last_name,
            email: username,
            age,
            password: createHash(password),
            role:
              username === "adminMuju@Muju.com" &&
              password === "adminPassword"
                ? "admin"
                : "user",
          };

          let result = await userRepository.register(newUser);
          return done(null, result);
        } catch (error) {
          return done("Error al registrar usuario: " + error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          let user = await userRepository.getByEmail(username);
          if (!user) {
            return done(null, false, {
              message: "Usuario y/o contraseña incorrectos",
            });
          }
          if (!isValidPassword(user, password)) {
            return done(null, false, {
              message: "Usuario y/o contraseña incorrectos",
            });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([
          (req) => {
            return req.signedCookies
              ? req.signedCookies.currentUser
              : req.cookies?.currentUser;
          },
        ]),
        secretOrKey: JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload.user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id || user.id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await User.findById(id);
    done(null, user);
  });
};

export { initializePassport, JWT_SECRET };
