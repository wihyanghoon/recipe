import express from "express";
import Video from "../models/Video";

const router = express.Router();

router.get("/", async (req, res) => {
  const video = await Video.find({});
  console.log(video);
  return res.render("home", { pageTitle: "Home", video });
});

router.get("/login", (req, res) => {
  res.send("login page");
});

router.get("/search", async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
        // i 소문자 대문자 구분 없이 하게 해주는것
      },
    });
  }
  res.render("search", { pageTitle: "search", videos });
});

router.get("/watch");

export default router;
