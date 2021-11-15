const mongoose = require("mongoose");

const printingTypeSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            trim: true,
            maxlength: 32
        },
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 256
        }
    }
);

module.exports = mongoose.model('PrintingType', printingTypeSchema);