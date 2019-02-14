const express = require("express");
const server = express();
const path = require("path");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const shoppingcart = require("./models/todoSchma");
mongoose.connect("mongodb://rk:123456a@ds331135.mlab.com:31135/shoppingcart", {
  useNewUrlParser: true
});
const todo = mongoose.model("shoppingcart");
mongoose.Promise = Promise;
server.use(bodyparser.json());
server.use(bodyparser.urlencoded({ extended: true }));

server.use("/", express.static(path.join(__dirname, "public")));

server.post("/addItem", async (req, res) => {
  const cart = await new shoppingcart(req.body);
  cart.total = req.body.price * req.body.quantity;
  cart.save();
  console.log(cart);
  res.send(cart);
});

server.get("/getdata", async (req, res) => {
  const list = await todo.find();
  console.log(list);
  res.json(list);
});

server.delete("/delete/:id", async (req, res) => {
  const item = await todo.findByIdAndDelete({ _id: req.params.id });
});

server.put("/update/:id", async (req, res) => {
  const store = await todo.findOneAndUpdate({_id: req.params.id}, req.body, {new: true});
  console.log(store);
  res.send(store);
});
server.listen(3001, () => {
  console.log(`server is running`);
});
