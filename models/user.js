const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, required: true, minLength: 5, maxLength: 30},
    password: {type: String, required: true, minLength: 5},
    status: {type: String, enum: ['regular','member', 'admin'], required: true}
});

module.exports = mongoose.model('User', UserSchema);