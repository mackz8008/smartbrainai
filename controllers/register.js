const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  //   bcrypt.hash(password, 10, function (err, hash) {
  //     // Store hash in your password DB.
  //     console.log(hash);
  //   });
  if (!email || !name || !password) {
    return res.status(400).json("incorrect form submission");
  }
  const hash = bcrypt.hashSync(password, 10);
  //   database.users.push({
  //     id: "125",
  //     name: name,
  //     email: email,
  //     // password: password,
  //     entries: 0,
  //     joined: new Date(),
  //   });
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            //   console.log(user[0]);
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json("unable to register"));

  //   res.json(database.users[database.users.length - 1]);
};

module.exports = {
  handleRegister: handleRegister,
};
