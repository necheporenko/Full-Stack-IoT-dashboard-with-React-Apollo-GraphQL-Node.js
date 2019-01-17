// Підключення всіх необхідних пакетів
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
// Підключення файлів з папок config, resolves, typeDefs
import { SERVER_PORT, corsDomain, DB_HOST, DB_PORT, DB_NAME } from './config';
import typeDefs from './typeDefs';
import resolvers from './resolvers';

const { ObjectId } = mongoose.Types;
ObjectId.prototype.valueOf = function () {
  return this.toString();  // Приведення типу ObjectId до типу строки
};
// Підключення до бази даних
mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.once('open', () => console.log('✔️  MongoDB: Connection succeeded'));
db.on('error', () => { throw new Error('❌  MongoDB: Unable to connect') });
// Ініціалізація фреймворка express
const app = express();
app.disable('x-powered-by');
// Підключення бібліотек-підсилювачів
app.use(bodyParser.json());
app.use(cors({
  origin: corsDomain,
  optionsSuccessStatus: 200
}));
// Підключення вмісту папок resolves та typeDefs до серверу
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
// Встановлення всіх підсиювачів
server.applyMiddleware({ app, path: '/graphql' });
// Запуск сервера на вказаному порті, що лежить в змінній SERVER_PORT
app.listen(SERVER_PORT, () => console.log(`🚀  Server listening on port: ${SERVER_PORT}`));


