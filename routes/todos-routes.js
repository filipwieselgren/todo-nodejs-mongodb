const express = require("express");
const utils = require("../utils.js");
const router = express.Router();
const db = require("../datebase/database.js");
const { ObjectId } = require("mongodb");

router.get("/", async (req, res) => {
  const colletion = await db.getTodosCollection();
  const todos = await colletion
    .find()
    .sort([["created", "desc"]])
    .toArray();

  console.log(todos);

  res.render("home", { todos });
});

router.post("/todos/skapa", async (req, res) => {
  const date = new Date();
  let currentDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  const todo = {
    description: req.body.description,
    created: currentDate,
    done: false,
  };

  if (utils.validateTodo(todo)) {
    const todoCollection = await db.getTodosCollection();
    const result = await todoCollection.insertOne(todo);

    res.redirect("/");
  } else {
    res.render("home", {
      error: "Fel på inmatad data",

      todo: todo.description,
    });
  }
});

router.get("/todos/:id", async (req, res) => {
  let id = undefined;

  try {
    id = ObjectId(req.params.id);
  } catch {
    next();
  }
  if (id) {
    const collection = await db.getTodosCollection();
    collection.findOne({ _id: id }, (err, todo) => {
      if (todo) {
        res.render("todos/todos-single", todo);
      } else {
        next();
      }
    });
  }
});

router.post("/todos/:id/ta-bort", async (req, res, next) => {
  let id = undefined;

  try {
    id = ObjectId(req.params.id);
  } catch {
    next();
  }

  if (id) {
    const collection = await db.getTodosCollection();
    const result = await collection.deleteOne({ _id: id });

    res.redirect("/");
  }
});

router.get("/todos/:id/redigera", async (req, res, next) => {
  let id = undefined;

  try {
    id = ObjectId(req.params.id);
  } catch {
    next();
  }

  if (id) {
    const collection = await db.getTodosCollection();
    collection.findOne({ _id: id }, (err, todo) => {
      if (todo) {
        res.render("todos/todos-edit", todo);
      } else {
        next();
      }
    });
  }
});

router.post("/todos/:id/redigera", async (req, res, next) => {
  const colletion = await db.getTodosCollection();
  const todos = await colletion.find().toArray();
  let id = undefined;

  try {
    id = ObjectId(req.params.id);
  } catch {
    next();
  }
  if (id) {
    const todo = { description: req.body.description };
    const valid = utils.validateTodo(todo);

    if (utils.validateTodo(todo)) {
      const collection = await db.getTodosCollection();
      const result = await collection.updateOne({ _id: id }, { $set: todo });

      res.redirect("/");

      console.log(result);
      console.log(req.body.done);
    } else {
      res.render("todos/todos-edit", {
        error: "Fel på inmatad data",
        _id: id,

        description: todo.description,
      });
    }
  }
});

router.get("/todos/:id/markera-som-klar", async (req, res) => {
  const id = ObjectId(req.params.id);
  const todosCollection = await db.getTodosCollection();
  const getDb = await db.getDb();

  await getDb.collection("todos").findOne({ _id: id }, async (err, todo) => {
    const updateTodo = {
      done: !todo.done,
    };

    await getDb
      .collection("todos")
      .updateOne({ _id: id }, { $set: { done: !todo.done } });
    console.log(todo.done);
    res.redirect("/");
  });
});

module.exports = router;
