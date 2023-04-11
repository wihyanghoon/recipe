import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.sitename = "Youtube";
  res.locals.user = req.session.user || {};
  
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

export const uploadProfile = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 300,
  },
});

export const uploadVideo = multer({
  dest: "uploads/videos/",
});
