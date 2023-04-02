import express from "express";
import morgan from "morgan";
import globalRouter from "./Routers/globalRouter"

const PORT = 4000
const app = express();
const logger = morgan("dev")

//Routers
app.use(logger)
app.use("/", globalRouter)
// app.use("/user", userRouter)
// app.use("/video", videoRouter)

const gossipMiddleware = (req, res, next) => {
    console.log(`메소드는 ${req.method} URL은 ${req.url}`)
    next()
}

app.listen(PORT, () => {
    console.log(`server listen port ${PORT} 🚀`)
})


