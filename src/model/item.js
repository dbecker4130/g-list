const mongoose = require('mongoose');
const { Schema } = mongoose;

const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  listId: { 
    type: Schema.Types.ObjectId, 
    required: true,
  },
});

const Item = mongoose.model('item', itemSchema);

module.exports = {
  Item
};
