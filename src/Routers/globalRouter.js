import express from "express";
import Video from "../models/Video";
import User from "../models/User";
import bcrypt from "bcrypt"
import { isLoggedIn, isNotLoggedIn } from "../middlewares";

const router = express.Router();

router.get("/", async (req, res) => {
  const video = await Video.find({}).populate("owner");
  
  return res.render("home", { pageTitle: "Home", video });
});

router.get("/login", isNotLoggedIn , (req, res) => {
  res.render("login", { pageTitle: "login page" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email })
  if(!user) {
    return res.status(400).render("login", { pageTitle: "Login", errorMessage: "아이디가 없습니다."})
  }
  const ok = await bcrypt.compare(password, user.password);

  if(!ok) {
    return res.status(400).render("login", { pageTitle: "Login", errorMessage: "비밀번호 틀림"})
  }
  req.session.loggedIn = true;
  req.session.user = user;
  
  console.log("로그인 성공됬다잉")
  return res.redirect("/")
});


router.get("/logout", (req, res)=>{
  req.session.destroy();
  res.redirect("/")
})

router.get("/search", async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
        // i 소문자 대문자 구분 없이 하게 해주는것
      },
    }).populate("owner");
  }
  res.render("search", { pageTitle: "search", videos });
});



export default router;
