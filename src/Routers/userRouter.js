import express from "express";
import User from "../models/User";

const router = express.Router();

router.get("/join", (req, res) => {
  res.render("join", { pageTitle: "join" });
});

router.post("/join", async (req, res) => {
  const { name, email, password, username, location } = req.body;

  const exists = await User.exists({ $or: [{ username }, { email }] });

  if (exists) {
    return res.render("join", {
      pageTitle: "Join",
      errorMessage: "This email/username is already taken",
    });
  }

  if (emailExists) {
    return res.render("join", {
      pageTitle: "Join",
      errorMessage: "This email is already taken",
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

export default router;
