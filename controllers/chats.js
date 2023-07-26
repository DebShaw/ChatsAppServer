import Chat from "../models/Chat.js";
import Profile from "../models/User.js";

export const accessChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("User Id param not sent with request");
    return res.status(400);
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  isChat = await Profile.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email",
  });
  if (isChat.length > 0) {
    res.status(200).json(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(fullChat);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

export const fetchChat = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await Profile.populate(results, {
          path: "latestMessage.sender",
          select: "name email",
        });
        res.status(200).json(results);
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  const users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(400)
      .json({ message: "A group must have more than 2 users" });
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updatedChat) {
      res.status(404).json({ message: "Chat Not Found" });
    } else {
      res.status(200).json(updatedChat);
    }
  } catch (err) {
    console.log(err);
  }
};

export const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    const addedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!addedChat) {
      res.status(404).json({ message: "Chat Not Found" });
    } else {
      res.status(200).json(addedChat);
    }
  } catch (err) {
    console.log(err);
  }
};

export const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    const removedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!removedChat) {
      res.status(404).json({ message: "Chat Not Found" });
    } else {
      res.status(200).json(removedChat);
    }
  } catch (err) {
    console.log(err);
  }
};
