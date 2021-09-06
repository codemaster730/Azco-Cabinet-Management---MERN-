const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    inout: {
        type: String,
        required: true
    },
    move_stock: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    move_name: {
        type: String,
        required: true
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model("Report", ReportSchema);
