require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { ApolloServer, gql } = require('apollo-server-express');

const PORT = process.env.PORT;
const url = process.env.MONGODB_URI;

mongoose.connect(url, { useNewUrlParser: true });
mongoose.connection.once('open', () => console.log(`Connected to mongo at ${url}`));

const { Item } = require('./model/item');

const typeDefs = gql`
  type Item {
    id: ID
    name: String
    desc: String
  }

  type Query {
    getItems: [Item]
  }

  type Mutation {
    addItem(name: String!, desc: String!): Item
    deleteItem(id: ID!) : Item
  }
`;

// Resolvers define the technique for fetching the types defined in the schema.
const resolvers = {
    Query: {
      getItems: async () => await Item.find({}).exec(),
    },
    Mutation: {
        addItem: async (_, args) => {
            try {
                let response = await Item.create(args);
                return response;
            } catch(e) {
                return e.message;
            }
        },
        deleteItem: async (_, args) => {
            try {
                await Item.findByIdAndRemove(args.id);
                console.log('deleteItem()', args);
                
            } catch(e) {
                console.log('ERROR', e.message);
                return e.message;
            }
        }
    }
  };

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
server.applyMiddleware({ app });
app.use(cors())

app.listen({ port: PORT }, () => {
    console.log(`🚀  Server ready at http://localhost:4000${server.graphqlPath}`);
});
