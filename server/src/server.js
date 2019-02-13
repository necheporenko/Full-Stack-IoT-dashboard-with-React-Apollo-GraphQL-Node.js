import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import morgan from "morgan";
import { ApolloServer } from "apollo-server-express";
// Connect files from folders config, resolves, typeDefs
import { SERVER_PORT, corsDomain, DB_HOST, DB_PORT, DB_NAME } from "./config";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";

const { ObjectId } = mongoose.Types;
ObjectId.prototype.valueOf = function() {
  return this.toString(); // Bring the ObjectId type to the String type
};

const options = {
  autoIndex: false, // Don't build indexes
  reconnectTries: 30, // Retry up to 30 times
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  useNewUrlParser: true
};

const connectWithRetry = () => {
  console.log("🚀  MongoDB: Start connection");
  mongoose
    .connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, options)
    .then(() => {
      console.log("✔️  MongoDB: Connection succeeded");
    })
    .catch(err => {
      console.log("❌  MongoDB: Unable to connect, retry after 5 seconds.");
      setTimeout(connectWithRetry, 5000);
    });
};

const app = express();
app.disable("x-powered-by");

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
  cors({
    origin: corsDomain,
    optionsSuccessStatus: 200
  })
);
// Connect the contents of the folders resolves and typeDefs to the server
const server = new ApolloServer({
  typeDefs,
  resolvers
});
// Installing all middlewares
server.applyMiddleware({ app, path: "/graphql" });

app.get("/", (req, res) => {
  res.send("Welcome!");
  console.log("Hello from the console!");
});

app.listen(SERVER_PORT, () => console.log(`🚀  Server listening on port: ${SERVER_PORT}`));
