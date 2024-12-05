const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const SettingsSchema = new mongoose.Schema({
  dispName: {
    type: String,
    trim: true,
    set: setName,
  },
  url: {
    type: String,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

SettingsSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  url: doc.url,
});

const SettingsModel = mongoose.model('Settings', SettingsSchema);
module.exports = SettingsModel;
