import express from "express"
import Video from "../models/Video"


const router = express.Router()

router.get("/", async (req, res) => {
    
    const video = await Video.find({});
    console.log(video)
    return res.render("home", { pageTitle: "Home", video })
})

router.get(("/login"), (req, res) => {
    res.send("login page")
})



router.get("/watch")

export default router