const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MembersSchema = new Schema(
  {
    member: {
      type: String,
      required: true,
      unique: true
    },
    weights: [
      {
      date: String,
      weight: Number
      }
    ]
  }
);

module.exports = mongoose.model('members', MembersSchema);
