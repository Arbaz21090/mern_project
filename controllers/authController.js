/** @format */

const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const hashPassword = require("./../utils/authHelper");
const orderModel = require("../models/orderModel");
// const productModel = require("../models/productModel");

const registerController = async (req, res) => {
  try {
    const { name, email, password, address, phone, answer } = req.body;
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ error: "Email is required" });
    }
    if (!password) {
      return res.send({ error: "Password is required" });
    }
    if (!phone) {
      return res.send({ error: "phone is required" });
    }
    if (!address) {
      return res.send({ error: "Address is required" });
    }
    if (!answer) {
      return res.send({ error: "answer is required" });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User Already Registered Please Login",
      });
    }
    //register user
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      answer,
      password: hashedPassword,
    }).save();
    res.status(201).send({
      success: true,
      message: "Registration Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};
//login controller

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: true,
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).send({
        success: false,
        message: "Email or Password is invalid",
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({
      success: true,
      message: "Login Successful",
      user: {
        name: user.name,
        email: user.email,
        password: user.password,
        phone: user.phone,
        address: user.address,
        answer: user.answer,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Login Failed ",
    });
  }
};
const testController = async (req, res) => {
  res.send("protectd");
};

//forgot password controller
const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      return res.status(400).send({
        message: "Answer is required",
      });
    }
    if (!newPassword) {
      return res.status(400).send({
        message: "newPassword is required",
      });
    }
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "email and answer is Invalid",
      });
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashed = await bcrypt.hash(newPassword, salt);
    await userModel.findByIdAndUpdate(user?._id, { password: hashed });

    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server Error",
      error,
    });
  }
};
//update profile controller
const updateProfileController = async (req, res) => {
  try {
    const { name, email, address, phone, password } = req.body;

    const user = await userModel.findByIdAndUpdate(req.user._id);
    if (password && password.length < 8) {
      res.json({ error: "password is required and 6 character long" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        email: email || user.email,
        address: address || user.address,
        phone: phone || user.phone,
        password: hashpassword || user.password,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "user updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "Error in updating data of user",
      error,
    });
  }
};
//ordrs controller
const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting orders",
      error,
    });
  }
};
const getAllOrdersController = async (req, res) => {
  try {
    const AllOrders = await orderModel
      .find({})
      .populate("products", "photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(AllOrders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting All Orders",
      error,
    });
  }
};
const statusUpdateController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error whitle updating status",
      error,
    });
  }
};
const getAllUsersController = async (req, res) => {
  try {
    const AllUsers = await userModel.find({});
    res.status(200).send({
      success: false,
      message: "All Users",
      AllUsers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting All Users",
      error,
    });
  }
};
module.exports = {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  statusUpdateController,
  getAllUsersController,
};
