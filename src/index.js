require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { ApolloServer, gql } = require('apollo-server-express');

const PORT = process.env.PORT;
const url = process.env.MONGODB_URI;

mongoose.connect(url, { useNewUrlParser: true, useFindAndModify: false });
mongoose.connection.once('open', () => console.log(`Connected to mongo at ${url}`));

const { Item } = require('./model/item');
const { List } = require('./model/list');

const typeDefs = gql`
  type List {
    id: ID!
    name: String!
    items: [Item!]!
  }

  type Item {
    id: ID!
    name: String!
    listId: ID!
  }

  type Query {
    getItems: [Item!]!
    getItem(id: ID!): Item!
    getLists: [List!]!
    getList(id: ID!): List!
  }

  type Mutation {
    addList(name: String!): List!
    addItem(name: String!, listId: ID!): Item!
    deleteItem(id: ID!) : Item!
  }
`;

// Resolvers define the technique for fetching the types defined in the schema.
const resolvers = {
    Query: {
      getItems: async () => await Item.find({}).exec(),
      getLists: async () => await List.find({}).exec(),
    },
    Mutation: {
        addList: async (_, args) => {
            try {
                let response = await List.create(args);
                console.log('res', response);
                
                return response;
            } catch(e) {
                console.log('ERROR', e.message);
                return e.message;
            }
        },
        addItem: async (_, { name, listId }) => {
            try {
                let response = await Item.create({ name, listId });
                console.log('res', response);
                
                return response;
            } catch(e) {
                console.log('ERROR', e.message);
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
    },
    List: {
        items: async ({ id }, args) => {
            const items = await Item.find({ listId: id }).exec();
            console.log('ITEMS in resolver', items);
            
            return items;
        }
    },
  };

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
server.applyMiddleware({ app });
app.use(cors())

app.listen({ port: PORT }, () => {
    console.log(`🚀  Server ready at http://localhost:4000${server.graphqlPath}`);
});
