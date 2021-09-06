const mongoose = require("mongoose");

const CabinetSchema = new mongoose.Schema({
    cabinet_name: {
        type: String,
        required : true
    },
    cabinet_desc: {
        type: String
    },
    cabinet_supplier: {
        type: String,
        required: true
    },
    lead_time: {
        type: Number,
        required: true
    },
    cabinet_stock: {
        type: Number,
        required: true
    },
    out_stock: {
        type: Number,
        default: 0
    },
    is_permitted: {
        type: Boolean,
        default: false
    },
    sales_flow: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("Cabinet", CabinetSchema);
