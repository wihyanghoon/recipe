
import "./db";
import "./models/Video";
import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors"
//router
import globalRouter from "./Routers/globalRouter";
import userRouter from "./Routers/userRouter";
import videoRouter from "./Routers/videoRouter";
import apiRouter from "./Routers/apiRouter"
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  })
);


app.use(localsMiddleware);
app.use(logger);
app.set("view engine", "pug");
app.set("views", `${process.cwd()}/src/views`);
app.use(express.urlencoded({ extended: true })); // 프론트에서 넘어온 값 req.body 인코딩
app.use(express.json())
app.use("/img", express.static("img"))
app.use("/uploads", express.static("uploads")) // 업로드 폴더 사용할수 있게 설정
app.use("/static", express.static("assets")) // 웹팩에 사용한 폴더를 읽을수 있게 설정
app.get("/add-one", (req, res, next) => {
  return res.send(`${req.session.id}`);
});

//Routers
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter)

export default app;
