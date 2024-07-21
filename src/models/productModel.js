const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: { type: String, require: [true, "Product name is required"] },
  price: { type: Number, require: [true, "Product price is required"] },
  description: {
    type: String,
    require: [true, "Product description is required"],
  },
  image: { type: String, require: [true, "Product image is required"] },
  quantity: { type: Number, require: [true, "Product quantity is required"] },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
