import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { ApolloServer } from 'apollo-server-express';
// Connect files from folders config, resolves, typeDefs
import { SERVER_PORT, corsDomain, DB_HOST, DB_PORT, DB_NAME } from './config';
import typeDefs from './typeDefs';
import resolvers from './resolvers';

const { ObjectId } = mongoose.Types;
ObjectId.prototype.valueOf = function () {
  return this.toString();  // Bring the ObjectId type to the String type
};

// Connect to a database
mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.once('open', () => console.log('✔️  MongoDB: Connection succeeded'));
db.on('error', () => { throw new Error('❌  MongoDB: Unable to connect') });

const app = express();
app.disable('x-powered-by');

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors({
  origin: corsDomain,
  optionsSuccessStatus: 200
}));
// Connect the contents of the folders resolves and typeDefs to the server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
// Installing all middlewares
server.applyMiddleware({ app, path: '/graphql' });

app.listen(SERVER_PORT, () => console.log(`🚀  Server listening on port: ${SERVER_PORT}`));


