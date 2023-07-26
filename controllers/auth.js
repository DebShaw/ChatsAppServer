import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Profile from "../models/User.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await Profile.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User Don't Exists!" });
    }
    const isPasswordCrrct = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCrrct) {
      return res.status(400).json({ message: "Wrong Password" });
    }
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.status(200).json({
      _id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      isAdmin: existingUser.isAdmin,
      pic: existingUser.pic,
      token,
    });
  } catch (err) {
    res.status(500).json("Something went wrong...");
  }
};

export const signup = async (req, res) => {
  const { name, email, password, pic } = req.body;
  try {
    const existingUser = await Profile.findOne({ email });
    if (existingUser) {
      return res.status(404).json({ message: "User Already Exists!" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await Profile.create({
      name,
      email,
      password: hashedPassword,
      pic,
    });
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res
      .status(200)
      .json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        pic: newUser.pic,
        token,
      });
  } catch (err) {
    res.status(500).json("Something went wrong!");
  }
};
