const mongoose = require("mongoose");

const expenseSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
    },
    item: {
        type: mongoose.Types.ObjectId,
        ref: "item",
    },
    quantity: Number,
    ownPrice: Number,
    partiallyPaid: Number,
    date: Date,
    paid: Boolean,
});
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const itemSchema = mongoose.Schema({
    item: {
        type: String,
        required: true,
    },
    price: Number,
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
    },
});
itemSchema.index({ item: 1, user: 1 }, { unique: true });

const User = mongoose.model("user", userSchema);
const Expense = mongoose.model("expense", expenseSchema);
const Item = mongoose.model("item", itemSchema);
module.exports = { User, Expense, Item };
