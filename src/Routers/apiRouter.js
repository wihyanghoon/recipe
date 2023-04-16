import express from "express";
import Video from "../models/Video";

const router = express.Router();

router.post("/videos/:id([0-9a-f]{24})/view", async (req, res) => {
  const { id } = req.params;
  const video = await Video.findByIdAndUpdate(
    id, // 문자열로 전달
    {
      $inc: {
        "meta.views": 1 // $inc 연산자를 사용하여 조회수 증가
      }
    },
    { new: true }
  );

  console.log(video)
  if (!video) {
    return res.sendStatus(404);
  }
  return res.sendStatus(200);
});

router.post("/videos/:id([0-9a-f]{24})/comment", async (req, res) => {
    console.log(req.params.id)
    console.log(req.body)
    res.end()
})

export default router;
