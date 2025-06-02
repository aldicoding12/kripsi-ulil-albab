import express from "express";
import CockieParse from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3000;

// middelawre json
app.use(express.json());
app.use(CockieParse());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

// import lainnya
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";

// import rout
import authRouter from "./routers/authRoute.js";
import newsRoute from "./routers/newsRoute.js";
import financeRouter from "./routers/financeRouter.js";

// router
app.use("/api/ul/data/user/", authRouter);
app.use("/api/ul/data/news", newsRoute);
app.use("/api/ul/data/finance", financeRouter);

// middlewares
app.use(notFound);
app.use(errorHandler);
app.use(express.static("./public"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//koneksi ke database
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("Connected!"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));
