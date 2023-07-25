require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/getAccessToken", async (req, res) => {
  const params = `?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_SECRET}&code=${req.query.code}`;

  await fetch(`https://github.com/login/oauth/access_token${params}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      res.json(data);
    });
});

app.get("/getUser", async (req, res) => {
  await fetch(`https://api.github.com/user`, {
    method: "GET",
    headers: {
      Authorization: req.get("Authorization"),
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      res.json(data);
    });
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
