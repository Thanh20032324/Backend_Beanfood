const { default: mongoose } = require('mongoose');
var db = require('./db');

const historySchame = new mongoose.Schema({
    userId: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        require: true,
    },
    restaurantName: {
        type: String,
        require: true,
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId, // Hoặc String, nếu bạn lưu trữ ID như một chuỗi
            required: true
        },
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        }
    }],
    toltalprice:{ 
        type: Number,
        require: true
    },
    phuongthucthanhtoan:{
        type: String,
        require: true,
    },
    status: {
        type: Number,
        required: true,
        enum: [0, 1],  
        default: 0     
    },
    notes:{
        type: String,
        require: false,
    },
    time: {
        type: Date,
        require: true,
    },

},
{
    collection: 'History'
}
);
let History = db.mongoose.model('History', historySchame);
module.exports = {
    History
}
