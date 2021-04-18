const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pv2sf.mongodb.net/${process.env.DB_DATA}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});
client.connect((err) => {
  const collection = client.db("admindata").collection("services");
  const makeAdminCollection = client.db("admindata").collection("makeAdmin");
  const paymentCollection = client.db("admindata").collection("payment");
  const reviewCollection = client.db("admindata").collection("review");

  app.post("/addServices", (req, res) => {
    collection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.post("/addAdmin", (req, res) => {
    makeAdminCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.post("/addReview", (req, res) => {
    reviewCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.post("/addpayment", (req, res) => {
    paymentCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/showServices", (req, res) => {
    collection.find({}).toArray((err, doc) => {
      res.send(doc);
    });
  });
  app.get("/showbooking", (req, res) => {
    paymentCollection.find({ email: req.query.email }).toArray((err, doc) => {
      res.send(doc);
    });
  });
  app.get("/showreview", (req, res) => {
    reviewCollection.find({}).toArray((err, doc) => {
      res.send(doc);
    });
  });
  app.post("/isAdmin", (req, res) => {
    const email = req.body.email;
    makeAdminCollection.find({ email: email }).toArray((err, doctors) => {
      res.send(doctors.length > 0);
    });
  });

  app.get("/showpayment", (req, res) => {
    paymentCollection.find({}).toArray((err, doc) => {
      res.send(doc);
    });
  });
  // perform actions on the collection object
  app.delete("/delete/:id", (req, res) => {
    collection.deleteOne({ _id: ObjectId(req.params.id) }).then((result) => {
      console.log(result);
      res.send(result.deletedCount > 0);
    });
  });
  app.patch("/update/:id", (req, res) => {
    paymentCollection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: { status: req.body.statusUpdate },
        }
      )
      .then((result) => {
        res.send(result.matchedCount > 0);
      });
  });
});

app.listen(port);
