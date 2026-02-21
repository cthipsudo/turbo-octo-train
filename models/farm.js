const mongoose = require("mongoose");
const { Schema } = mongoose;
const Product = require("./product");
const farmSchema = new Schema({
  name: {
    type: String,
    required: [true, "Farm must have a name!"],
  },
  city: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email Required"],
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

// Does not have access to date after deletion
// farmSchema.pre("findOneAndDelete", async function (data) {
//   console.log("PRE MIDDLEWARE");
//   console.log(data);
// });

// Has access to data after deletion
farmSchema.post("findOneAndDelete", async function (farm) {
  if (farm.products.length) {
    const res = await Product.deleteMany({ _id: { $in: farm.products } });
    console.log(res);
  }
});

const Farm = mongoose.model("Farm", farmSchema);

module.exports = Farm;
