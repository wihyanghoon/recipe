import express from "express";
import Video from "../models/Video";

const router = express.Router();

router.get("/", async (req, res) => {
  console.log("start");
  const result = Video.find({});
  Video.find({}).then(() => {
    res.render("home", { pageTitle: "Home", videos: [] });
  });
});

router.get("/:id([0-9a-f]{24})", async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  video
    ? res.render("watch", { pageTitle: video.title, video })
    : res.render("404", { pageTitle: "video not fonud" });
});

router.get("/:id([0-9a-f]{24})/edit", async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "page is not found" });
  }
  res.render("edit", { pageTitle: "change video", video });
});

router.post("/:id([0-9a-f]{24})/edit", async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "page is not found" });
  }
  const update = await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashTags: Video.formatHashtags(hashtags)
  });
  console.log(update)
  res.redirect(`/videos/${id}`);
});

router.get("/upload", (req, res) => {
  res.render("upload", { pageTitle: "upload" });
});

// 비디오 추가 로직
router.post("/upload", async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    const dbVideo = await Video.create({
      title,
      description,
      hashTags: Video.formatHashtags(hashtags)
        
    });
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
});


// 삭제
router.get("/:id([0-9a-f]{24})/delete", async (req, res) => {
  const { id } = req.params
  await Video.findByIdAndDelete(id)
  return res.redirect("/")
})

export default router;
