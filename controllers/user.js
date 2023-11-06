import UserModel from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

    return res
      .status(200)
      .json({
        message: "Login successful",
        jwt_token: jwt_token,
        jwt_refresh_token: jwt_refresh_token,
      });
  });
};

export { REGISTER_USER, LOGIN };
