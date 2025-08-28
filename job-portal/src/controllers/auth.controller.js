import { addUser, confirmLogin } from "../models/user.model.js";

export async function getLogin(req, res) {
  res.render("pages/auth/login", { user: req.session.user, error: null });
}

export async function getRegister(req, res) {
  res.render("pages/auth/register", { user: req.session.user, error: null });
}

export async function postRegister(req, res) {
  const { name, email, password, role } = req.body;  
  try {
    await addUser({ 
      name, 
      email, 
      password, 
      role: role || "jobseeker"  
    });
    res.redirect("/auth/login");
  } catch (e) {
    res.status(400).render("404", {
      error: e.message,
      user: null,
    });
  }
}
export async function postLogin(req, res) {
  const { email, password } = req.body;
  const result = await confirmLogin(email, password);
  if (result === "Invalid User") {
    return res.status(401).render("404", {
      error: "user not found pls register",
      user: null,
    });
  }
  else if (result === "Invalid Credentials") {
    return res.status(401).render("404", {
      error: "Invalid credentials",
      user: null,
    });
  }
  else {
  req.session.user = { id: result.id, name: result.name, email: result.email, role: result.role };
  return res.redirect("/jobs");
}
  
}

export function postLogout(req, res) {
  req.session.destroy(() => res.redirect("/"));
}
