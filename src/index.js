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
const { Board } = require('./model/board');

const typeDefs = gql`
  type Board {
    id: ID!
    name: String!
    lists: [List!]!
  }
  type List {
    id: ID!
    boardId: ID!
    name: String!
    items: [Item!]!
  }

  type Item {
    id: ID!
    listId: ID!
    name: String!
  }

  type Query {
    getBoards: [Board!]!
    getBoard(id: ID!): Board!
    getList(id: ID!): List!
    # getItems: [Item!]!
    # getItem(id: ID!): Item!
  }

  type Mutation {
    addBoard(name: String): Board!
    addList(name: String!, boardId: ID!): List!
    addItem(name: String!, listId: ID!): Item!
    editItem(id: ID!, name: String!): Item!
    deleteList(id: ID!): List
    deleteItem(id: ID!): Item
  }
`;

// Resolvers define the technique for fetching the types defined in the schema.
const resolvers = {
  Query: {
    getBoards: async () => await Board.find({}).exec(),
    getBoard: async (_, {id}) => await Board.findById(id),
    getList: async (_, {id}) => await List.findById(id),
    // getLists: async () => await List.find({}).exec(),
    // getItems: async () => await Item.find({}).exec(),
  },
  Mutation: {
    // Boards
    addBoard: async (_, args) => {
      try {
        let response = await Board.create(args);
        console.log('res', response);
        return response;
      } catch(e) {
        console.log('ERROR', e.message);
        return e.message;        
      }
    },

    // Lists
    addList: async (_, { name, boardId }) => {
      try {
        let response = await List.create({ name, boardId });
        console.log('res', response);
        return response;
      } catch(e) {
        console.log('ERROR', e.message);
        return e.message;
      }
    },
    deleteList: async (_, args) => {
      try {
        await List.findByIdAndRemove(args.id);          
      } catch(e) {
        console.log('ERROR', e.message);
        return e.message;
      }
    },
    
    // Items
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
    editItem: async (_, { id, name }) => {
      try {                
        let response = await Item.findByIdAndUpdate(id, { name });
        console.log('RES', response);
        return response;
      } catch(e) {
        console.log('ERROR', e.message);
        return e.message;
      }
    },
    deleteItem: async (_, args) => {
      try {
        await Item.findByIdAndRemove(args.id);
      } catch(e) {
        console.log('ERROR', e.message);
        return e.message;
      }
    }
  },
  Board: {
    lists: async ({ id }, args) => {
      const lists = await List.find({ boardId: id }).exec();
      return lists;
    }
  },
  List: {
    items: async ({ id }, args) => {
      const items = await Item.find({ listId: id }).exec();      
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
