import passport from "passport";

export const passportCall = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({
          status: "error",
          message: info?.message ? info.message : "Token inválido",
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({
          status: "error",
          message: "Acceso denegado. Usuario no autenticado.",
        });
    }

    const userRole = req.user.role;

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        status: "error",
        message: `No autorizado. Se requiere uno de los siguientes roles: ${roles.join(
          ", "
        )}`,
      });
    }
    next();
  };
};

export const privateAccess = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.redirect("/login");
    }
    req.user = user;
    next();
  })(req, res, next);
};

export const publicAccess = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (user) {
      return res.redirect("/");
    }
    next();
  })(req, res, next);
};
