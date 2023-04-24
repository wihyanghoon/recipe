import express from "express";
import Video from "../models/Video";
import User from "../models/User";
import { isLoggedIn, uploadVideo } from "../middlewares";

const router = express.Router();

router.get("/:id([0-9a-f]{24})", async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id)
  .populate({
    path: "owner",
    model: "User"
  })
  .populate({
    path: "comments",
    populate: {
      path: "owner",
      model: "User"
    }
  });

  
  video
    ? res.render("watch", { pageTitle: video.title, video })
    : res.render("404", { pageTitle: "video not fonud" });
});

router.get("/:id([0-9a-f]{24})/edit", isLoggedIn, async (req, res) => {
  const { user: { _id } } = req.session
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    return res.render("404", { pageTitle: "page is not found" });
  }

  if(_id !== String(video.owner._id)){
    return res.status(403).redirect("/")
  }

  res.render("edit", { pageTitle: "change video", video });
});

router.post("/:id([0-9a-f]{24})/edit", isLoggedIn, async (req, res) => {
  const { user: { _id } } = req.session
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById(id);

  if (!video) {
    return res.render("404", { pageTitle: "page is not found" });
  }

  if(_id !== String(video.owner._id)){
    return res.status(403).redirect("/")
  }

  const update = await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashTags: Video.formatHashtags(hashtags),
  });

  res.redirect(`/videos/${id}`);
});

router.get("/upload", isLoggedIn, (req, res) => {
  res.render("upload", { pageTitle: "upload" });
});

// 비디오 추가 로직
router.post("/upload", isLoggedIn, uploadVideo.fields([{name: "video"}, {name: "thumb"}]), async (req, res) => {
    const { user: { _id } } = req.session;
    const { files : { video, thumb } } = req;
    console.log(req.files)

    const { title, description, hashtags } = req.body;
    try {
      const dbVideo = await Video.create({
        title,
        description,
        hashTags: Video.formatHashtags(hashtags),
        fileUrl: video[0].location,
        thumbUrl: thumb[0].location,
        owner: _id,
      });
      const user = await User.findById(_id)
      user.videos.push(dbVideo._id)
      user.save()
      return res.redirect("/");
    } catch (error) {
      console.log(error);
      return res.render("upload", {
        pageTitle: "Upload Video",
        errorMessage: error._message,
      });
    }
  }
);

// 삭제
router.get("/:id([0-9a-f]{24})/delete", isLoggedIn, async (req, res) => {
  const { user : { _id }} = req.session
  const { id } = req.params;
  
  const video = await Video.findById(id)
  
  if(_id !== String(video.owner._id)){
    return res.status(403).redirect("/")
  }
  
  await Video.findByIdAndDelete(id);
  
  const videoUser = await User.findById(_id)
  videoUser.videos.pop(_id)
  videoUser.save()
  
  return res.redirect("/");
});

export default router;
