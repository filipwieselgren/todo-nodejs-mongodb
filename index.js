const express = require("express");
const exphbs = require("express-handlebars");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(8000, () => {
  console.log("http://localhost:8000/");
});
