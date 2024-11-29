const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RefreshtokenSchema = new Schema(
  {
    refreshToken: {
      type: String,
      required: true,
      unique: true
    }
  }
);

module.exports = mongoose.model('tokens', RefreshtokenSchema);
