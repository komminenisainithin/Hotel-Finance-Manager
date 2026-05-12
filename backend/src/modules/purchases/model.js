import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase;