import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

export const isDeploy = process.env.NODE_ENV === "production";

const s3 = new aws.S3({
  region: "ap-northeast-2",
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

const s3Images = multerS3({
  s3: s3,
  bucket: "recipevideodb-image",
  acl: "public-read",
});

const s3Videos = multerS3({
  s3: s3,
  bucket: "recipevideodb-video",
  acl: "public-read",
});



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
    fileSize: 3.146e7,
  },
  storage: isDeploy ? s3Images : undefined,
});

export const uploadVideo = multer({
  dest: "uploads/videos/",
  storage: isDeploy ? s3Videos : undefined,
});
