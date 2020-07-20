if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");

const bcrypt = require("bcrypt");

const User = require("./models/Users");

const passport = require("passport");

const initializePassport = require("./passport-config");

initializePassport(passport, (email) => {
  return users.find((user) => user.email === email);
});

const app = express();

PORT = process.env.PORT || 5000;

app.set("view-engine", "ejs");

//MongoDb Configuration
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//MongoDb Connection
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to MongoDB"));

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const hashedPassword = bcrypt.hash(req.body.password, 10);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) throw err;
      user.password = hash;
      user
        .save()
        .then(() => {
          res.redirect("/login");
        })
        .catch((err) => console.log(err));
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server started on Port ${PORT}`);
});
