import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
    salesId: {
        type: Number,
        unique: true,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    morning: {
        type: Number,
        required: true,
        default: 0
    },
    evening: {
        type: Number,
        required: true,
        default: 0
    },
    total: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

salesSchema.pre("save", function () {
    this.total = Number(this.morning) + Number(this.evening);
});

const Sales = mongoose.model("Sales", salesSchema);

export default Sales;
