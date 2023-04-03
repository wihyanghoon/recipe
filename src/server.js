import "./db"
import "./models/Video"
import express from "express";
import morgan from "morgan";

//router
import globalRouter from "./Routers/globalRouter"
import userRouter from "./Routers/userRouter"
import videoRouter from "./Routers/videoRouter"


const app = express()
const logger = morgan("dev")

//Routers
app.use(logger)
app.set("view engine", "pug")
app.set("views", `${process.cwd()}/src/views`)
app.use(express.urlencoded({ extended: true })) // 프론트에서 넘어온 값 req.body 인코딩
app.use("/", globalRouter)
app.use("/users", userRouter)
app.use("/videos", videoRouter)

export default app


