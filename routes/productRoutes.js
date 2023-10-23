/** @format */

const express = require("express");
const {
  createProductController,
  getProductsController,
  getSingleProductController,
  deleteProductController,
  updateProductController,
  filterProductController,
  productCountController,
  productPerPageController,
  searchProductController,
  similarProductController,
  categorywiseProductController,
  paymentTokenController,
  braintreePaymentController,
  productPhotoController,
} = require("../controllers/productController");
const { authMiddleware, isAdmin } = require("./../middlewares/authMiddleware");
const formidable = require("express-formidable");
const router = express.Router();

router.post(
  "/create-product",
  authMiddleware,
  isAdmin,
  formidable(),
  createProductController
);
//product photo
router.get("/product-photo/:pid", productPhotoController);
// get All products
router.get("/get-products", getProductsController);
// get Single  products

router.get("/get-singleProduct/:slug", getSingleProductController);
// delete product
router.delete("/delete-product/:id", deleteProductController);
// update product

router.put(
  "/update-product/:id",
  authMiddleware,
  isAdmin,
  formidable(),
  updateProductController
);

//filter product
router.post("/filter-products", filterProductController);
// product count
router.get("/product-count", productCountController);
//product per page
router.get("/product-list/:page", productPerPageController);
//search product
router.get("/search/:keyword", searchProductController);
//similar product
router.get("/similarproduct/:pid/:cid", similarProductController);

//category wise product
router.get("/product-category/:slug", categorywiseProductController);

//Payment route token
router.get("/braintree/token", paymentTokenController);
//payment gateway api
router.post("/braintree/payment", authMiddleware, braintreePaymentController);
module.exports = router;
