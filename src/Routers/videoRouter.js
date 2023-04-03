import express from "express"
import Video from "../models/Video"

const router = express.Router()


router.get("/", async (req, res) => {
    console.log("start")
    const result = Video.find({});
    Video.find({}).then(()=> {
        console.log("fdfd")
        res.render("home", { pageTitle: "Home", videos: [] })
    })
    
})

router.get("/:id(\\d+)", (req, res) => {
    const { id } = req.params
    const video = videos[id - 1]
    res.render("watch", { pageTitle: `watching` })
})


router.get("/:id(\\d+)/watch", (req, res) => {
    res.render("home", { pageTitle: "Home" })
})


router.get("/:id(\\d+)/edit", (req, res) => {
    const { id } = req.params
    const video = videos[id - 1]
    res.render("edit", { pageTitle: `Edit` })
})

router.post("/:id(\\d+)/edit", (req, res) => {
    const { id } = req.params
    const { title } = req.body
    videos[id - 1].title = title
    console.log(title)
    res.redirect(`/videos/${id}`)
})

router.get("/upload", (req, res) => {
    res.render("upload", { pageTitle: "upload" })
})

// 비디오 추가 로직
router.post("/upload", async (req, res) => {
    const { title, description, hashtags} = req.body
    const video = new Video({
        title,
        description,
        createAt: Date.now(),
        hashTags: hashtags.split(",").map((item) => `#${item}`),
        meta: {
            views: 0,
            rating: 0,
        }
    })
    await video.save()
    return res.redirect("/")
})

export default router