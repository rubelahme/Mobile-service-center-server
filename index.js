const express = require("express");
const app = express();
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const bodyParser = require("body-parser");

const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.obyna.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const collectionAdmin = client.db("assinment11").collection("assinment");
  const collectionOrders = client.db("assinment11").collection("Order");
  const collectionReview = client.db("assinment11").collection("Review");
  const collectionAdminEmail = client.db("assinment11").collection("admin");

  app.post("/admin", (req, res) => {
    const user = req.body;
    collectionAdminEmail.insertOne(user).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/admin", (req, res) => {
    collectionAdminEmail
      .find({ email: req.query.email })
      .toArray((err, result) => {
        res.send(result[0]);
      });
  });

  app.post("/review", (req, res) => {
    const user = req.body;
    collectionReview.insertOne(user).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/review", (req, res) => {
    collectionReview.find().toArray((err, result) => {
      res.send(result);
    });
  });

  app.post("/order", (req, res) => {
    const user = req.body;
    collectionOrders.insertOne(user).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/order", (req, res) => {
    collectionOrders.find({ email: req.query.email }).toArray((err, result) => {
      res.send(result);
    });
  });
  app.get("/orders", (req, res) => {
    collectionOrders.find().toArray((err, result) => {
      res.send(result);
    });
  });

  app.post("/users", (req, res) => {
    const user = req.body;
    collectionAdmin.insertOne(user).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/users", (req, res) => {
    collectionAdmin.find().toArray((err, result) => {
      res.send(result);
    });
  });

  app.delete("/delete/:id", (req, res) => {
    collectionAdmin
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });

  app.get("/users/:id", (req, res) => {
    collectionAdmin
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, item) => {
        res.send(item[0]);
      });
  });
});

app.listen(port);
