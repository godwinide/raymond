const { model, Schema } = require("mongoose");

const UserSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    balance: {
        type: String,
        required: false,
        default: 0
    },
    btcBalance: {
        type: String,
        required: false,
        default: 0
    },
    invested: {
        type: String,
        required: false,
        default: 0
    },
    accountLevel: {
        type: String,
        required: false,
        default: "STARTER"
    },
    currency: {
        type: String,
        required: false,
        default: "$"
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: false,
        default: false
    },
    upgrade: {
        type: Boolean,
        required: false,
        default: false
    },
    regDate: {
        type: Date,
        required: false,
        default: Date.now()
    }
});

module.exports = User = model("User", UserSchema);

