const models = require('../models');

const { Settings } = models;

const updateSettings = async (req, res) => {
  // console.log(req.body);
  const set = await Settings.findOneAndUpdate({ owner: req.session.account._id }, req.body);
  console.log(set);
  res.status(200).json({ status: 'updated!!!' });
};

module.exports = {
  updateSettings,
};
