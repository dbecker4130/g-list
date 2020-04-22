const mongoose = require('mongoose');
const { Schema } = mongoose;

const boardSchema = new Schema({
  name: {
    type: String, 
    required: true,
  },
  lists: [
    {
      type: Schema.Types.ObjectId, 
      ref: 'list',
    },
  ],
});

const Board = mongoose.model('board', boardSchema);

module.exports = {
  Board
};