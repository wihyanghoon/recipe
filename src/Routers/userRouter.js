import express from "express";
import User from "../models/User";
import fetch from "node-fetch";
import { isLoggedIn } from "../middlewares";

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
    console.log(existingUser);
    if (existingUser) {
      req.session.loggedIn = true;
      req.session.user = existingUser;
      return res.redirect("/");
    } else {
      const user = await User.create({
        avata: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
      req.session.loggedIn = true;
      req.session.user = user;
      console.log(session);
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

router.post("/edit", isLoggedIn, async (req, res) => {
  const { email: sessionEmail } = req.session.user;
  const { name, email, location } = req.body;
  console.log(name, email, location);
  const update = await User.findOneAndUpdate({ email: sessionEmail }, { name, location }, { new: true })
  console.log(update)
  req.session.user = update
  res.redirect("/users/edit")
});

router.get("change-password", (req, res) => {
  res.render("change-password", { pageTitle : "change password"})
})

router.post("change-password", (req, res) => {
  res.redirect("/")
})

export default router;
