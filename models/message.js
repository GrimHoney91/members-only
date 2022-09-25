const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {DateTime} = require('luxon');

const MessageSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true, maxLength: 100},
    timeStamp: {type: Date, required: true, default: Date.now},
    text: {type: String, required: true, maxLength: 500}
});


MessageSchema
.virtual('time_stamp_formatted')
.get(function() {
    return DateTime.fromJSDate(this.timeStamp).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('Message', MessageSchema);