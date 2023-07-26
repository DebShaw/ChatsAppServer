import jwt from "jsonwebtoken";
import Profile from "../models/User.js";

const auth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      let decodeData = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await Profile.findById(decodeData.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      console.log(error);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
};

export default auth;
