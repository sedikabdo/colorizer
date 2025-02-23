const socketIo = require("socket.io");

let io;

const initSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "*", // يمكنكِ تعديل هذا حسب بيئتكِ
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // الانضمام إلى غرفة خاصة بالمستخدم
    socket.on("joinChat", ({ userId, friendId }) => {
      const room = [userId, friendId].sort().join("_"); // غرفة فريدة لكل زوج من المستخدمين
      socket.join(room);
      console.log(`User ${userId} joined room ${room}`);
    });

    // استقبال الرسالة من العميل وبثها للمستلم فقط
    socket.on("sendMessage", (message) => {
      console.log("Received message:", message);
      const room = [message.sender_id, message.receiver_id].sort().join("_");
      io.to(room).emit("newMessage", message); // بث الرسالة للغرفة فقط
    });

    // استقبال تحديث الصورة وبثه لجميع المتصلين
    socket.on("updateAvatar", ({ userId, avatar }) => {
      console.log(`Avatar updated for user ${userId}: ${avatar}`);
      io.emit("avatarUpdated", { userId, avatar }); // بث التحديث للجميع
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = { initSocket, getIO };