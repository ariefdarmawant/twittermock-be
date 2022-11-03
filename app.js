const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

// parse request berbentuk json
app.use(bodyParser.json());

// parse request form/url-encoded
app.use(bodyParser.urlencoded({ extended: true }));

require("./routes/auth.routes")(app);
require("./routes/tweet.routes")(app);

const db = require("./models");

const Tweet = db.tweet;
const User = db.user;

function initial() {
  User.create({
    username: "akuntest",
    email: "akuntest@gmail.com",
    name: "Akun Test",
    phoneNumber: "+6281123123",
    password: bcrypt.hashSync("Test Password"),
  });
  Tweet.create({
    text: "Test Tweet",
    parentId: null,
    userId: 1,
  });
  Tweet.create({
    text: "Test Children",
    parentId: 1,
    userId: 1,
  });
}

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync Db");
  initial();
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
