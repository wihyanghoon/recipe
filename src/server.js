import express from "express";
import morgan from "morgan";

//router
import globalRouter from "./Routers/globalRouter"
import userRouter from "./Routers/userRouter";
import videoRouter from "./Routers/videoRouter";

const PORT = 4000
const app = express();
const logger = morgan("dev")

//Routers
app.set("view engine", "pug")
app.use(logger)
app.use("/", globalRouter)
app.use("/users", userRouter)
app.use("/videos", videoRouter)

app.listen(PORT, () => {
    console.log(`server listen port ${PORT} 🚀`)
})


