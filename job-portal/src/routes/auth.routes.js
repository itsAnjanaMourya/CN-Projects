import { Router } from "express";
import { getLogin, getRegister, postLogin, postRegister, postLogout } from "../controllers/auth.controller.js";
import { redirectIfAuthed } from "../middlewares/auth.middleware.js";
import { authValidators } from "../middlewares/validate.middleware.js";

const r = Router();

r.get("/login", redirectIfAuthed, getLogin);
r.post("/login", authValidators.login, postLogin);

r.get("/register", redirectIfAuthed, getRegister);
r.post("/register", authValidators.register, postRegister);

r.post("/logout", postLogout);

export default r;
