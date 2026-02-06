const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    mine: 0,
  },
  category: {
    type: String,
    lowercase: true,
    enum: ["fruit", "vegatable", "dairy"],
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
