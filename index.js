require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const todosRouter = require("./routes/todos-routes");

const app = express();

app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
  })
);

app.set("view engine", "hbs");

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use("/", todosRouter);

app.listen(8000, () => {
  console.log("http://localhost:8000/");
});
