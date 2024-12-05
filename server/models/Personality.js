const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const PersonalitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  url: {
    type: String,
    trim: true,
    required: true,
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

PersonalitySchema.statics.toAPI = (doc) => ({
  name: doc.name,
  link: doc.link,
});

const PersonalityModel = mongoose.model('Personality', PersonalitySchema);
module.exports = PersonalityModel;
