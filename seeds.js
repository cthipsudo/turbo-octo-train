const mongoose = require("mongoose");
const Product = require("./models/product");

mongoose
  .connect("mongodb://127.0.0.1:27017/farmStand")
  .then(() => {
    console.log("Mongo Connection Open!!");
  })
  .catch((err) => {
    console.log("Something went wrong on Mongo.", err);
  });

// const p = new Product({
//   name: "Honeydew",
//   price: 1.99,
//   category: "fruit",
// });

// p.save()
//   .then((p) => {
//     console.log(p);
//   })
//   .catch((err) => console.log(err));

const seedProducts = [
  { name: "Rashberry", price: 2.99, category: "fruit" },
  { name: "Cheese", price: 5.99, category: "dairy" },
  { name: "Potato Chips", price: 3.99, category: "vegatable" },
  { name: "Watermelon", price: 4.99, category: "fruit" },
  { name: "Sliced Apples", price: 8.99, category: "fruit" },
];

Product.insertMany(seedProducts)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
