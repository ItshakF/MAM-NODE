const express = require("express");
const bodyParser = require("body-parser");
const fs = require('fs');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

function loadJson(fileName = '') {
  return JSON.parse(
    fs.existsSync(fileName)
    ? fs.readFileSync(fileName)
    : '""'
  )
}

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'Post added successfully'
  });
});

app.get("/api/operations", (req, res, next) => {
  const data = JSON.parse(fs.readFileSync("operations.json"));
  res.status(200).json({
    balance: data.balance[data.balance.length - 1],
    associates: data.associates,
    operations: data.operations[data.balance.length - 1]
  });
});

app.get("/api/all", (req, res, next) => {
  res.status(200).json(JSON.parse(fs.readFileSync("operation.json")));
});

app.post("/api/save", (req, res, next) => {
  const register = JSON.parse(fs.readFileSync("operations.json"));
  const operation = req.body;
  register.balance.push(operation.balance);
  register.associates = operation.associates;
  register.operations.push(operation.operation);
  fs.writeFileSync("operation.json", JSON.stringify(register, null, 2));
  res.status(201).json({message: 'Operation added successfully'})
})

module.exports = app;
