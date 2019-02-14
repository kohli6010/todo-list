const mongoose = require('mongoose');
let shoppingcart = new mongoose.Schema({
    todo: {
        type: String,
        require: `Enter a Todo`
    },
    date_of_shopping: {
        type: Date,
        default: Date.now()
    },
    price: Number,
    quantity: Number,
    total: Number
})

module.exports = mongoose.model("shoppingcart", shoppingcart);