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
        required: true
    },
    btcBalance: {
        type: String,
        required: true
    },
    invested: {
        type: String,
        required: true
    },
    accountLevel: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    regDate: {
        type: Date,
        required: false,
        default: Date.now()
    }
});

module.exports = User = model("User", UserSchema);

