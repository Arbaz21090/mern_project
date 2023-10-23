/** @format */

const express = require("express");
const {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  statusUpdateController,
  getAllUsersController,
} = require("../controllers/authController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
//router object
const router = express.Router();
//routing

//Register || method post
router.post("/register", registerController);
//login || method post
router.post("/login", loginController);
//forgot password method post
router.post("/forgot-password", forgotPasswordController);
//test
router.get("/test", authMiddleware, isAdmin, testController);
//protected user route auth
router.get("/user-auth", authMiddleware, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});
//protected admin route auth
router.get("/admin-auth", authMiddleware, isAdmin, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});
//update profile
router.put("/update-profile", authMiddleware, updateProfileController);

//orders
router.get("/orders", authMiddleware, getOrdersController);

//All Orders
router.get("/All-orders", authMiddleware, isAdmin, getAllOrdersController);

//order status update
router.put(
  "/orderstatus-update/:orderId",
  authMiddleware,
  isAdmin,
  statusUpdateController
);
router.get("/getAllUsers", authMiddleware, isAdmin, getAllUsersController);
module.exports = router;
