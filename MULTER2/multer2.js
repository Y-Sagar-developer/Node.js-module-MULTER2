const express = require("express");
const app = express();
app.use(express.json());
const port = 3006;
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const connection = require("./db.js");
const mysql = require("mysql2");

const my_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: my_storage });

app.post("/upload", upload.single("file"), (req, res) => {
  if (req.file.mimetype !== "image/png" || req.file.mimetype !== "image/img") {
    res.status(400).send("invali formate only png is supported");
  } else if (req.file.size <= 5 * 1024 * 1024) {
    res.status(400).send("file too large max size is 5mb");
  } else {
    // res.send("file stoered successfully");
    const name = req.body.name;
    const filename = req.file.filename;
    const filepath = req.file.path;

    let sql = `insert into files(file_name,file_path,name) values (?,?,?)`;
    connection.query(sql, [filename, filepath, name], (err, result) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send("data stored succu in db");
      }
    });
  }
});

app.get("./getfiles", (req, res) => {
  let sql = `select * fro  files`;
  connection.query(sql, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.json(
        result.map((file) => {
          return __dirname + file.file_path;
        })
      );
    }
  });
});

app.listen(3006, () => {
  console.log("server has been running");
});
