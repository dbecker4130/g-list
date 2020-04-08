const mongoose = require('mongoose');
const { Schema } = mongoose;

const itemSchema = new Schema({
    name: String,
    desc: String
});

const Item = mongoose.model('item', itemSchema);

module.exports = {
    Item
};
