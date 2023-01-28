const path = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "*",
  })
);
const getDataFromFile = (cb) => {
  fs.readFile("data/items.json", "utf8", (error, data) => {
    if (error) {
      cb([]);
    }
    cb(data);
  });
};
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
// app.use(cors);
app.get("/getItems", function (req, res, next) {
  getDataFromFile((data) => {
    // console.log(data);
    res.type("json");
    res.send(data);
    res.end();
  });
});
app.post("/addItem", function (req, res, next) {
  getDataFromFile((data) => {
    // console.log(req.body);
    let details = JSON.parse(Object.keys(req.body)[0]);
    data = JSON.parse(data);
    data.push(details);
    fs.writeFile("data/items.json", JSON.stringify(data), (error) => {
      if (error) {
        res.status(404);
        res.end();
      } else {
        res.status(200);
        res.send("OK");
        res.end();
      }
    });
  });
});
app.post("/removeItem", function (req, res, next) {
  getDataFromFile((data) => {
    let details = JSON.parse(Object.keys(req.body)[0]);
    data = JSON.parse(data);
    data = data.filter((item) => item.id != details.id);
    fs.writeFile("data/items.json", JSON.stringify(data), (error) => {
      if (error) {
        res.status(404);
        res.end();
      } else {
        res.status(200);
        res.send("OK");
        res.end();
      }
    });
  });
});
const PORT = process.env.PORT || 8000;
app.listen(PORT);
