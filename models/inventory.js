const mongoose = require('mongoose');
const inventorySchema = mongoose.Schema({
    productName: {
        type: String,
        required :true
    },
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref:'user',
    },
    buyingPrice : {
        type:String,
        required :true
    },
    sellingPrice : {
        type:String,
        required :true
    },
    supplierName: {
        type:String,
        required :true},
    category : {
        type:String,
        required :true
    }
});

module.exports = mongoose.model('inventory',inventorySchema);