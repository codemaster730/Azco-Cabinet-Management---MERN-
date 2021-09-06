const mongoose = require("mongoose");

const UnitSchema = new mongoose.Schema({
    unit_name: {
        type: String,
        required : true
    },
    cabinet_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Cabinet'
    },
    unit_stock: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Unit", UnitSchema);
