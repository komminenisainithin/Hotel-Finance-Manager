import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
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

salesSchema.pre("save", function (next) {
    this.total = this.morning + this.evening;
    next();
});

const Sales = mongoose.model("Sales", salesSchema);

export default Sales;
