import Profile from "../models/User.js";

export const allUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    const users = await Profile.find(keyword).find({
      _id: { $ne: req.user._id },
    });
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
  }
};
