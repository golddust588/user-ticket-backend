import UserModel from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import mongoose from "mongoose";

const REGISTER_USER = async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const user = new UserModel({
      name: req.body.name,
      email: req.body.email,
      password: hash,
      bought_tickets: [],
      money_balance: req.body.money_balance,
    });

    const response = await user.save();

    const jwt_token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
      { algorithm: "RS256" }
    );

    const jwt_refresh_token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
      { algorithm: "RS256" }
    );

    return res.status(200).json({
      status: "User registered",
      response: response,
      jwt_token: jwt_token,
      jwt_refresh_token: jwt_refresh_token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "Something went wrong" });
  }
};

const LOGIN = async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    return res.status(401).json({ message: "Bad authentication" });
  }

  bcrypt.compare(req.body.password, user.password, (err, isPasswordMatch) => {
    if (!isPasswordMatch || err) {
      return res.status(401).json({ message: "Bad authentication" });
    }

    const jwt_token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
      { algorithm: "RS256" }
    );

    const jwt_refresh_token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
      { algorithm: "RS256" }
    );

    return res.status(200).json({
      message: "Login successful",
      jwt_token: jwt_token,
      jwt_refresh_token: jwt_refresh_token,
    });
  });
};

const GET_NEW_JWT_TOKEN = async (req, res) => {
  try {
    const jwt_refresh_token = req.headers.authorization;

    // jwt.verify(jwt_refresh_token, process.env.JWT_SECRET, (err, decoded) => {
    //   if (err) {
    //     return res.status(401).json({ message: "Bad auth" });
    //   }

    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(jwt_refresh_token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });

    const jwt_token = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
      { algorithm: "RS256" }
    );
    return res.status(200).json({
      status: "User is logged in",
      jwt_token: jwt_token,
      jwt_refresh_token: jwt_refresh_token,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ status: "User must log in again" });
  }
};

const GET_ALL_USERS = async (req, res) => {
  try {
    const users = await UserModel.find().sort({ name: "asc" });
    return res.status(201).json({ users: users });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const GET_USER_BY_ID = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.params.id });
    return res.status(201).json({ user: user });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "Not found" });
  }
};

export {
  REGISTER_USER,
  LOGIN,
  GET_NEW_JWT_TOKEN,
  GET_ALL_USERS,
  GET_USER_BY_ID,
};
