import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import chatRoutes from "./routes/chats.js";
import messageRoutes from "./routes/message.js";
import connectDB from "./config/db.js";
import { Server } from "socket.io";

const app = express();
dotenv.config();
connectDB();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("This is a ChatsApp Api");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, console.log(`Server running on PORT ${PORT}`));

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://chats-app-by-ds.netlify.app",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) {
      return console.log("chat users not defined");
    }
    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) {
        return;
      }
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
