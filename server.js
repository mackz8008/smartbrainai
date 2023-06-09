const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    // port: 5432,
    user: "andrew",
    password: "",
    database: "smart-brain",
  },
});

// console.log(
//   db
//     .select("*")
//     .from("users")
//     .then((data) => {
//       console.log(data);
//     })
// );

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// const database = {
//   users: [
//     {
//       id: "123",
//       name: "John",
//       email: "john@test.com",
//       password: "cookie",
//       entries: 0,
//       joined: new Date(),
//     },
//     {
//       id: "124",
//       name: "Sally",
//       email: "sally@test.com",
//       password: "banana",
//       entries: 0,
//       joined: new Date(),
//     },
//   ],
// };

app.get("/", (req, res) => {
  //   res.send.json("this is working");
  //   res.send(database.users);
});

// app.post("/signin", (req, res) => {
//   signin.handleSignin(req, res, db, bcrypt);
// });

app.post("/signin", signin.handleSignin(db, bcrypt));

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.post("/imageurl", (req, res) => {
  image.handleApiCallNode(req, res);
});

// Load hash from your password DB.

app.listen(3002, () => {
  console.log("app is running on port 3002");
});

/*
/ --> res = thisis working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/
