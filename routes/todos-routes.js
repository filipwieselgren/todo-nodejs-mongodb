const express = require("express");
const utils = require("../utils.js");
const router = express.Router();
const db = require("../datebase/database.js");
const { ObjectId } = require("mongodb");

router.get("/", async (req, res) => {
  const colletion = await db.getTodosCollection();
  const todos = await colletion.find().toArray();

  res.render("home", { todos });
});

router.post("/", async (req, res) => {
  const date = new Date();
  let currentDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  const todo = {
    description: req.body.description,
    created: currentDate,
    done: false,
  };

  //   if (utils.validateTodo(todo)) {
  const todoCollection = await db.getTodosCollection();
  const result = await todoCollection.insertOne(todo);

  // res.redirect("/" + result.insertedId);
  console.log(todo);
  res.redirect("/");
  //   } else {
  //     res.render("home", {
  //       error: "Fel på inmatad data",
  //       //Behåller datan i inputfältet
  //       todo: todo.description,
  //     });
  //   }

  //   console.log(todo);
  //   res.redirect("/");
});

module.exports = router;
