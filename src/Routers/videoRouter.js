import express from "express"

const router = express.Router()


router.get("/", (req, res) => {
    res.send("video")
})


router.get("/watch/:id(\\d+)", (req, res) => {
    res.render("watch")
})


router.get("/edit", (req, res) => {
    res.render("edit")
})

router.get("/delete", (req, res) => {
    
})

export default router