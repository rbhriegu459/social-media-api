const express = require('express');
const app = express();
const {ApolloServer} = require('@apollo/server');
const {Server} = require('socket.io');
const {expressMiddleware} =  require("@apollo/server/express4");
const connectToMongoDB = require("./src/utils/mongoose.js");
const {typeDefs, resolvers} = require("./src/graphql/Schema.js");
const {fileURLToPath} = require("url");
const path = require("path");
const {createServer} =  require("http");

const server = createServer(app);
const io = new Server(server);

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const port = 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, "/src/views")));

async function main() {
  const gqlServer = new ApolloServer({typeDefs, resolvers});
  await gqlServer.start();

  app.use("/graphql", expressMiddleware(gqlServer));

  app.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname, "/src/views/index.html"));
  });

  connectToMongoDB()
    .then(async () => {
      console.log("Mongodb connected");
      server.listen(
        port,
        console.log(
          `GraphQL ApolloServer running \nExpress running on port ${port}`
        )
      );
      
    })
    .catch((err) => {
      console.log("database not connected", err);
    });
}

main();

// socket connections for chat posts
io.on("connection", (socket) => {

  // send-post event and recieve-post broadcast
  socket.on("send-post", (post) => {
    socket.broadcast.emit("receive-post", post);
  });
});