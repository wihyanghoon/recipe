import express from "express";
import User from "../models/User";
import Video from "../models/Video"
import fetch from "node-fetch";
import { isLoggedIn, uploadProfile, } from "../middlewares";
import bcrypt from "bcrypt"

const router = express.Router();

router.get("/join", (req, res) => {
  res.render("join", { pageTitle: "join" });
});

router.post("/join", async (req, res) => {
  const { name, email, password, username, location } = req.body;

  const exists = await User.exists({ $or: [{ username }, { email }] });

  if (exists) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "This email/username is already taken",
    });
  }
  await User.create({
    name,
    email,
    password,
    username,
    location,
  });
  res.redirect("/login");
});

router.get("/github/start", (req, res) => {
  const config = {
    client_id: process.env.GIT_HUB,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const baseUrl = `https://github.com/login/oauth/authorize?${params}`;
  return res.redirect(baseUrl);
});

router.get("/github/finsh", async (req, res) => {
  const config = {
    client_id: process.env.GIT_HUB,
    client_secret: process.env.GIT_HUB_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const baseUrl = `https://github.com/login/oauth/access_token?${params}`;
  const data = await fetch(baseUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const json = await data.json();
  if ("access_token" in json) {
    const { access_token } = json;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    
    const emailObj = emailData.find(
      (emails) => emails.primary === true && emails.verified === true
    );
      
    if (!emailObj) {
      return res.redirect("/login");
    }
    const existingUser = await User.findOne({ email: emailObj.email });

    if (existingUser) {
      req.session.loggedIn = true;
      req.session.user = existingUser;
      return res.redirect("/");
    } else {
      const user = await User.create({
        avatar: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
      req.session.loggedIn = true;
      req.session.user = user;
      
      return res.redirect("/");
    }
  } else {
    return res.redirect("/login");
  }
});

router.get("/edit", isLoggedIn, (req, res) => {
  if (!req.session.user) {
    res.redirect("/");
  }
  res.render("edit-profile", { pageTitle: "Edit Profile" });
});

router.post("/edit", isLoggedIn, uploadProfile.single("avatar"), async (req, res) => {
  const { file } = req
  
  const { email: sessionEmail } = req.session.user;
  const { name, email, location } = req.body;

  const update = await User.findOneAndUpdate(
    { email: sessionEmail },
    { name, location, avatar: file ? `/${file.path}` : "" },
    { new: true }
  );
  req.session.user = update;
  res.redirect("/users/edit");
});

router.get("/change-password", (req, res) => {
  res.render("change-password", { pageTitle: "change password" });
});

router.post("/change-password", async (req, res) => {
  
  const {
    session: {
      user: { email, password },
    },
    body: { oldPassword, newPassword, newPasswordCheck },
  } = req;

  
  const ok = await bcrypt.compare(oldPassword, password)
  
  if(!ok){
    return res.status(404).render("change-password", { pageTitle: "Change Password" , errorMessage: "기존 비밀번호가 틀렸습니다."})
  }

  if(newPassword !== newPasswordCheck) {
    return res.status(404).render("change-password", { pageTitle: "Change Password" , errorMessage: "비밀번호가 일치하지 않습니다."})
  }

  const user = await User.findOneAndUpdate(
    { email },
    { password: newPassword },
    { new: true }
  )
  await user.save();
  return res.redirect("/logout")
});

router.get("/:id", async (req, res)=> {
  const { id } = req.params
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User"
    }
  })

  if(!user) {
    return res.status(404).render("404", { pageTitle : "없는 유저입니다."})
  }
  console.log(user)
  return res.render("profile", { pageTitle: `${user.name} 프로필`, user })
})

export default router;
