import express from "express";
import asyncHandler from "../middlewares/asyncHandler.js";
import {
  userRegistration,
  userLogin,
  userLogout,
} from "../controllers/userController.js";

//import model
import User from "../models/userModels.js";

const router = express.Router();

router.post("/register", userRegistration);

router.post("/login", userLogin);

router.post("/logout", userLogout);

router.get("/getUser", (req, res) => {
  res.send("getUser");
});

export default router;
