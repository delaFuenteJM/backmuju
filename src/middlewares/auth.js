import passport from 'passport';

export const privateAccess = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) return next(err); 

        if (!user) {
            return res.redirect('/login');
        }

        req.user = user;
        next();
    })(req, res, next);
};

export const publicAccess = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) return next(err);

        if (user) {
            return res.redirect('/products');
        }

        next();
    })(req, res, next);
};