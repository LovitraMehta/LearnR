import express from "express";

import { login, signup } from "../controllers/auth.js";
import { getUser, getAllUsers, updateProfile } from "../controllers/users.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/getAllUsers", getAllUsers); // 👈 static comes first
router.get("/:id", getUser); 
router.patch("/update/:id", auth, updateProfile);

export default router;
