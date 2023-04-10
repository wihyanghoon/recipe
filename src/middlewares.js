export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.sitename = "Youtube";
  res.locals.user = req.session.user;
  console.log("locals", res.locals);
  console.log(req.session);
  next();
};

export const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    return next();
  } else {
    return res.redirect("/login");
  }
};

export const isNotLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return next();
  } else {
    return res.redirect("/");
  }
};
