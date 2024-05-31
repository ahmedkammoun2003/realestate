import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { ErrorHandler } from "../utils/error.js";
import Jwt from "jsonwebtoken";
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hasherPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hasherPassword });
  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};
export const signin = async (req, res, next) => {
    console.log(req.body);
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(ErrorHandler(404, "User not found"));
    }
    if (!bcryptjs.compareSync(password, user.password)) {
      return next(ErrorHandler(401, "Invalid credentials"));
    }
    const { password: pass, ...rest } = user._doc;
    const token = Jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
export const google = async (req, res, next) => {
    try {

      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const token = Jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        const { password: pass, ...rest } = user._doc;
        res
          .cookie("access_token", token, { httpOnly: true })
          .status(200)
          .json(rest);
      } else {
        const generatePassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hasherPassword = bcryptjs.hashSync(generatePassword, 10);
        const newUser = new User({
          username:
            req.body.name.split(" ").join("").toLowerCase() +
            Math.random().toString(36).slice(-8),
          email: req.body.email,
          password: hasherPassword,
          avatar: req.body.photo,
        });
        await newUser.save();
        const token = Jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        const { password: pass, ...rest } = newUser._doc;
        res
          .cookie("access_token", token, { httpOnly: true })
          .status(200)
          .json(rest);
      }
    } catch (error) {
      next(error);
    }
  };
export const signout = async (req, res,next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json({
      success: true,
      message: "user logged out"
    });
  } catch (error) {
      next(error); 
  }
};