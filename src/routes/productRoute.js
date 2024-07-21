const express = require("express");
const Product = require("../models/productModel");

const productRouter = express.Router();

productRouter.post("/add", async (req, res) => {
  try {
    const { name, price, description, image, quantity } = req.body;
    if (!name || !price || !description || !image || !quantity) {
      return res
        .status(404)
        .send({ success: false, message: "Cannot leave empty fields!" });
    }
    let product = await Product.create(req.body);
    res.status(200).send({
      success: true,
      message: "Product successfully created.",
      product: product,
    });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

productRouter.get("/get-all", async (req, res) => {
  try {
    let products = await Product.find({});
    res.status(200).send({
      success: true,
      message: "All products successfully fetched",
      products: products,
    });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

productRouter.get("/get-by-id/:id", async (req, res) => {
  console.log(req.params);
  try {
    let id = req.params.id;
    let product = await Product.findById(id);
    console.log(product);
    res.status(200).send({
      success: true,
      message: "Product successfully fetched",
      product: product,
    });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

productRouter.put("/update", async (req, res) => {
  try {
    const { id } = req.body;
    // if (!name || !price || !description || !image || !quantity) {
    //   return res
    //     .status(404)
    //     .send({ success: false, message: "Cannot leave empty fields!" });
    // }
    let product = await Product.findByIdAndUpdate(id, req.body);
    res.status(200).send({
      success: true,
      message: "Product successfully updated.",
      product: product,
    });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

productRouter.delete("/delete", async (req, res) => {
  try {
    const { id } = req.body;
    let product = await Product.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Product successfully deleted.",
      product: product,
    });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

module.exports = productRouter;
