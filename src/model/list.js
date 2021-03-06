const mongoose = require('mongoose');
const { Schema } = mongoose;

const listSchema = new Schema({
  boardId: { 
    type: Schema.Types.ObjectId, 
    required: true,
  },
  name: {
    type: String, 
    required: true,
  },
  items: [
    {
      type: Schema.Types.ObjectId, 
      ref: 'item',
    },
  ],
});

const List = mongoose.model('list', listSchema);

module.exports = {
  List
};