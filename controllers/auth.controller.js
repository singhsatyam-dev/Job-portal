import {
  addUser,
  validateUser,
  findUserByEmail,
} from "../models/user.model.js";

export default class AuthController {
  getRegister(req, res) {
    res.render("auth/register", { title: "Register" });
  }

  postRegister(req, res) {
    const { name, email, password } = req.body;

    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.send("User already exists");
    }

    addUser({ name, email, password });
    res.redirect("/login");
  }

  getLogin(req, res) {
    if (req.session.user) {
      return res.redirect("/dashboard");
    }
    res.render("auth/login", { title: "Login" });
  }

  postLogin(req, res) {
    const { email, password } = req.body;

    const user = validateUser(email, password);

    // ❗ STOP execution immediately if invalid
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    // Set session
    req.session.user = user;

    // Set cookie BEFORE redirect
    res.cookie("lastVisit", new Date().toLocaleString(), {
      httpOnly: true,
    });

    // ❗ RETURN is mandatory
    return res.redirect("/dashboard");
  }

  logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  }
}
