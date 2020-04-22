const { Item } = require('./model/item');
const { List } = require('./model/list');
const { Board } = require('./model/board');

// Resolvers define the technique for fetching the types defined in the schema.
module.exports = {
  Query: {
    // Boards
    getBoards: async () => await Board.find({}).exec(),
    getBoard: async (_, {id}) => await Board.findById(id),
    // List
    getLists: async (_, {id}) => await List.find({ boardId: id }),
    getList: async (_, {id}) => await List.findById(id),
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
    editBoard: async (_, { id, name }) => {
      try {
        let response = await Board.findByIdAndUpdate(id, { name });
        console.log('RES', response);
        return response;
      } catch(e) {
        console.log('ERROR', e.message);
        return e.message;
      }
    },
    deleteBoard: async (_, args) => {
      try {
        await Board.findByIdAndRemove(args.id);
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
    editList: async (_, { id, name }) => {
      try {
        let response = await List.findByIdAndUpdate(id, { name });
        console.log('RES', response);
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
    moveItem: async (_, { id, listId }) => {
      try {
        let response = await Item.findByIdAndUpdate(id, { listId });
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
