const express = require("express");
const app = express();
app.use(express.json());
const multer = require("multer");
const connection = require("./db.js");
// const mysql = require("mysql2");

const my_storage = multer.diskStorage({
  destination: function (req, fil, cb) {
    cb(null, "./assets");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: my_storage });

app.post("/upload", upload.single("file"), (req, res) => {
  // res.send("file uploaded successfully")
  // console.log(req.file)
  if (req.file.mimetype !== "image/png") {
    res.status(400).send("invalid formate only png if supported");
  } else if (req.file.size >= 5 * 1024 * 1024) {
    res.status(200).send("file too large max size is 5mb");
  } else {
    // res.send("file uploaded successfully");
    const name = req.body.name;
    const filename = req.file.filename;
    const filepath = req.file.path;

    let sql = `insert into files (name,file_name,file_path) values (?,?,?) `;

    connection.query(sql, [name, filename, filepath], (err, result) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send("data stored in database");
      }
    });
  }
});

app.get("/getfiles", (req, res) => {
  let sql = `select * from files`;
  connection.query(sql, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      // res.send(result)
      res.json(
        result.map((val) => {
          return __dirname + val.file_path;
        })
      );
    }
  });
});

app.listen(3007, () => {
  console.log("server is running");
});
