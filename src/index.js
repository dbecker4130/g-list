require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');

const PORT = process.env.PORT;
const url = process.env.MONGODB_URI;

mongoose.connect(url, { useNewUrlParser: true, useFindAndModify: false });
mongoose.connection.once('open', () => console.log(`Connected to mongo at ${url}`));

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
server.applyMiddleware({ app });
app.use(cors())

app.listen({ port: PORT }, () => {
  console.log(`🚀  Server ready at http://localhost:4000${server.graphqlPath}`);
});
