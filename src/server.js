import express from "express";
import morgan from "morgan";

const PORT = 4000
const app = express();
const logger = morgan("dev")

const gossipMiddleware = (req, res, next) => {
    console.log(`메소드는 ${req.method} URL은 ${req.url}`)
    next()
}

app.use(logger)
app.get("/", (req, res) => {
    res.send("this is my server")
})

app.listen(PORT, () => {
    console.log(`server listen port ${PORT} 🚀`)
})