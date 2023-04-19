import express from "express";
import Video from "../models/Video";
import Comment from '../models/Comment';

const router = express.Router();

router.post("/videos/:id([0-9a-f]{24})/view", async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const video = await Video.findByIdAndUpdate(
    id, // 문자열로 전달
    {
      $inc: {
        "meta.views": 1, // $inc 연산자를 사용하여 조회수 증가
      },
    },
    { new: true }
  );
  if (!video) {
    return res.sendStatus(404);
  }
  return res.sendStatus(200);
});

router.post("/videos/:id([0-9a-f]{24})/comment", async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: { user },
  } = req;
  const video = await Video.findById(id)

  if(!video){
    return res.sendStatus(404)
  }

  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  })
  
  video.comments.push(comment._id)
  video.save()
  res.sendStatus(200)
});

export default router;
