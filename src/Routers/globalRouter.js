import express from "express"

const router = express.Router()


router.get("/", (req, res) => {
    res.send("hello global")
})

router.get("/:id", (req, res) => {
    console.log(req.params)
    return res.send(req.params)
})


router.get("/watch")

module.exports = router