const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 512
        },
        descr: {
            type: String,
            trim: true,
            maxlength: 1024
        },
        printingType: {
            type: ObjectId,
            ref: 'PrintingType',
            required: true
        },
        FPD_id: {
            type: String,
            trim: true,
            maxlength: 256
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);