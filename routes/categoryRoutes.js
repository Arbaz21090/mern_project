/** @format */

const express = require("express");
const { authMiddleware, isAdmin } = require("./../middlewares/authMiddleware");
const {
  createCategoryController,
  updateCategoryController,
  getAllCategoryController,
  getSingleCategoryController,
  deleteCategoryController,
} = require("../controllers/categoryController");
const router = express.Router();

// route
// create-category
router.post(
  "/create-category",
  authMiddleware,
  isAdmin,
  createCategoryController
);
// update category
router.put(
  "/update-category/:id",
  authMiddleware,
  isAdmin,
  updateCategoryController
);

// get route
router.get(
  "/get-allcategory",
  // authMiddleware,
  // isAdmin,
  getAllCategoryController
);
// single category
router.get("/get-singlecategory/:slug", getSingleCategoryController);
router.delete(
  "/delete-category/:id",
  authMiddleware,
  isAdmin,
  deleteCategoryController
);
module.exports = router;
