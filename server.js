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
    connectionString: process.env.DATABASE_URL,
    // ssl: { rejectUnauthorized: false },
    host: process.env.DATABASE_HOST,
    port: 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PWD,
    database: process.env.DATABASE_DB,
  },
});

console.log("smb starting...");
// console.log(db.select("*").from("users"));

// console.log(
//   db
//     .select("*")
//     .from("users")
//     .then((data) => {
//       console.log(data);
//     })
// );

const app = express();
const PORT = process.env.PORT || 3002;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("this is working");
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

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
