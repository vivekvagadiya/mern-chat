require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");

const connectDB = require("./config/db");

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  app.set("io", io);

  server.listen(PORT, () => {
    console.log(
      `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`,
    );
  });
};
startServer();
