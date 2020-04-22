const { gql } = require('apollo-server-express');

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
    getLists(id: ID!): [List!]!
    getList(id: ID!): List!
  }

  type Mutation {
    # Boards
    addBoard(name: String): Board!
    editBoard(id: ID!, name: String!): Board!
    deleteBoard(id: ID!): Board
    # Lists
    addList(name: String!, boardId: ID!): List!
    editList(id: ID!, name: String!): List!
    deleteList(id: ID!): List
    # Items
    addItem(name: String!, listId: ID!): Item!
    editItem(id: ID!, name: String!): Item!
    moveItem(id: ID!, listId: ID!): Item!
    deleteItem(id: ID!): Item
  }
`;

module.exports = typeDefs;