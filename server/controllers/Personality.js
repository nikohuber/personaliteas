const models = require('../models');

const { Personality } = models;

const makeP = async (req, res) => {
  console.log(req);
  if (!req.body.name || !req.body.url) {
    return res.status(400).json({ error: 'Both the name and url are required!' });
  }
  const pData = {
    name: req.body.name,
    url: req.body.url,
    owner: req.session.account._id,
  };

  try {
    const newP = new Personality(pData);
    await newP.save();
    return res.status(201).json({ name: newP.name, url: newP.url });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Personalitea already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making personalitea!' });
  }
};

const home = (req, res) => res.render('app');

const p = async (req, res) => {
  console.log(req.params);
  try {
    const query = { owner: req.params.id };
    const docs = await Personality.find(query).select('name url').lean().exec();
    return res.json({ ps: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving personalitea!' });
  }
};

const getP = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Personality.find(query).select('name url').lean().exec();
    return res.json({ ps: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving personalitea!' });
  }
};

const deleteP = async (req, res) => {
  console.log(`deleting ${req.body.id}`);
  const doc = await Personality.findByIdAndDelete(req.body.id);
  // const doc =  await Domo.findOneAndDelete({id: req.body.id});
  res.status(200).json({ response: `${doc} deleted!` });
};

module.exports = {
  home,
  makeP,
  getP,
  deleteP,
  p,
};
