const express = require("express");
const app = express();
const User = require("./models/user");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const session = require("express-session");

const isLogged = require("./middlewares/isLogged");

const sessionOptions = {
  secret: "my-secret",
  resave: false,
  saveUninitialized: false,
};

//mongo connection

const mongoose = require("mongoose");
const user = require("./models/user");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/authDemo");
  console.log("Connection open!");
}

app.use(bodyParser.json());

app.use(session(sessionOptions));

app.get("/secret", isLogged, (req, res) => {
  res.send("This is secret");
});

app.post("/user", async (req, res) => {
  const newUser = await User.create({
    username: req.body.username,
    password: req.body.password
    // password: await bcrypt.hash(req.body.password, 12),
  });

  newUser.save();

  res.send(newUser);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

    const foundUser = await User.findAndValidate(username, password)

  if (foundUser) {
    req.session.user_id = foundUser._id;
    return res.send("Welcome");
  }
  res.status(401).send("User or password incorrect");
});

app.post("/logout", async (req, res) => {
  req.session.user_id = null;
  //req.session.destroy() //Destroys all the session
  res.send("Logged out successfully");
});

app.listen(3000, () => {
  console.log("SERVING YOUR APP!");
});
