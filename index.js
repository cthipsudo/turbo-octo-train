const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const appError = require("./AppError");

const Product = require("./models/product");
const Farm = require("./models/farm");

mongoose
  .connect("mongodb://127.0.0.1:27017/farmStand3")
  .then(() => {
    console.log("Mongo Connection Open!!");
  })
  .catch((err) => {
    console.log("Something went wrong on Mongo.", err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const categories = ["fruit", "vegatable", "dairy"];

// FARM ROUTES

app.get("/farms", async (req, res) => {
  const farms = await Farm.find({});

  res.render("farms/index", { farms });
});

app.get("/farms/new", (req, res) => {
  res.render("farms/new");
});

app.post("/farms", async (req, res) => {
  const newFarm = new Farm(req.body);
  await newFarm.save();
  res.redirect("/farms");
});

app.get("/farms/:id", async (req, res) => {
  const { id } = req.params;
  const farm = await Farm.findById(id);
  res.render("farms/show", { farm });
});

app.get("/farms/:id/products/new", (req, res) => {
  const { id } = req.params;
  res.render("products/new", { categories, id });
});

app.post("/farms/:id/products", async (req, res) => {
  const { id } = req.params;
  const farm = await Farm.findById(id);
  const { name, price, category } = req.body;
  const newProduct = new Product({ name, price, category });
  farm.products.push(newProduct);
  newProduct.farm = farm;
  await farm.save();
  await newProduct.save();
  res.send(farm);
  //newProduct.save();
});

// PRODUCT ROUTES

app.get("/products", async (req, res) => {
  const { category } = req.query;
  if (category) {
    const products = await Product.find({ category });
    res.render("products/index", { products, category });
  } else {
    const products = await Product.find({});
    res.render("products/index", { products, category: "All things" });
  }
});

app.post("/products", async (req, res, next) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
  } catch (e) {
    next(e);
  }
});

app.get("/products/new", (req, res) => {
  res.render("products/new", { categories });
});

app.get("/products/:id", async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    throw new appError("Product Not Found", 404);
  }
  res.render("products/show", { product });
});

app.get("/products/:id/edit", async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    throw new appError("Product Not Found", 404);
  }
  res.render("products/edit", { product, categories });
});

app.put("/products/:id", async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  res.redirect(`/products/${product._id}`);
});

app.delete("/products/:id", async (req, res, next) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(id);
  res.redirect("/products");
});

const handleValidationErr = (err) => {
  console.dir(err);
  return new AppError(`Validation Failed...${err.message}`, 400);
};
// Custom Error Handler
app.use((err, req, res, next) => {
  console.log(err.name);
  if (err.name === "ValidationError") err = handleValidationErr(err);
  next();
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).send(message);
});

app.listen(3000, () => {
  console.log("APP is listening on port 3000");
});
