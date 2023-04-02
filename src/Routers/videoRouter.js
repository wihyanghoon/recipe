import express from "express"

const router = express.Router()


router.get("/", (req, res) => {
    res.send("video")
})


router.get("/watch/:id", (req, res) => {
    res.send("watch")
})

router.get("/delete", (req, res) => {
    
})

export default router