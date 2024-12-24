  const bodyParser = require("body-parser");
  const express = require("express");
  const fs = require("fs");
  const app = express();
  const port = 3000;
  const path= require('path');
  const cors= require('cors');
  app.use(bodyParser.json());
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }));
  
  
  let todo = [];
  let id = 1;
  const filepath = "todo.json";
  
  function loadTodo() {
    if (fs.existsSync(filepath)) {
        const data = fs.readFileSync(filepath, 'utf-8');
        todo = JSON.parse(data);
        if (todo.length > 0) {
            const ids = todo.map(t => t.id).filter(id => typeof id === 'number');
            id = ids.length > 0 ? Math.max(...ids) + 1 : 1;
        } else {
            id = 1;
        }
    } else {
        id = 1;
    }
}

  function saveTodos() {
    fs.writeFileSync(filepath, JSON.stringify(todo, null, 2), "utf-8");  
  }
  
  function findIndex(arr, id) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id) {
        return i;
      }
    }
    return -1;
  }
  
  function removeAtIndex(arr, id) {
    const index = findIndex(arr, id);
    if (index !== -1) {
      arr.splice(index, 1);
      return true;
    }
    return false;
  }
  
  function allTodo(req, res) {
    res.json(todo);
  }
  
  function getTodoById(req, res) {
    const index = findIndex(todo, parseInt(req.params.id));
    if (index !== -1) {
      res.status(200).json(todo[index]);
    } else {
      res.status(404).send("id not exists !!!");
    }
  }
  
  function createTodo(req, res) {
    const newTodo = {
      id: id++,
      title: req.body.title,
      description: req.body.description,
    };
    todo.push(newTodo);
    saveTodos();  
    res.status(200).json(newTodo);  
  }
  
  function deleteTodo(req, res) {
    const removed = removeAtIndex(todo, parseInt(req.params.id));
    if (removed) {
      saveTodos();  
      res.status(200).send("Deleted successfully");
    } else {
      res.status(404).send("ID not found");
    }
  }
  function updatedTodo(req, res) {
    const index = findIndex(todo, parseInt(req.params.id));
    if (index !== -1) {
      todo[index].title = req.body.title || todo[index].title;
      todo[index].description = req.body.description || todo[index].description;
      saveTodos();  
      res.status(200).json(todo[index]);
    } else {
      res.status(404).send("ID not found");
    }
  }

  loadTodo();
  
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'todo.html'));
  });
  
  app.get("/todo", allTodo);
  app.get("/todo/:id", getTodoById);
  app.post("/todo", createTodo);
  app.delete("/todo/:id", deleteTodo);
  app.put("/todo/:id", updatedTodo);

  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
  