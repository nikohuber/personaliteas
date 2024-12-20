const models = require('../models');

const { Personality, Settings } = models;

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

const view = (req, res) => res.render('view');

/* const getPersonObject = async (person) => {
  const docs = await Personality.find({ owner: person.owner }).select('name url').lean().exec();
  return docs;
}; */

const p = async (req, res) => {
  // console.log(req.params);
  try {
    const query = { url: req.params.id };
    const people = await Settings.find(query).select('owner').lean().exec();
    if (people.length === 0) {
      return res.json({ error: 'Personalitea not found...' });
    }

    let temp = [];

    /* eslint no-restricted-syntax: "off" */
    for await (const person of people) {
      const docs = await Personality.find({ owner: person.owner }).select('name url').lean().exec();
      temp = temp.concat(docs);
      console.log(docs);
    }

    // alternatively can be hardcoded to return one person that doesn't bypass airbnb,
    // that async for-of allows for multiple users to be returned that share the same source url.

    /*
    const docs = await Personality.find({owner: people[0].owner}).select('name url').lean().exec();
    temp = docs; */

    // console.log(docs);
    return res.json({ ps: temp });

    //
    // Various Failed Attempts at Recreating that async for loop...
    //

    // const docs = await Personality.find(people[0].owner).select('name url').lean().exec();

    /*
    let obj = [];

    people.forEach((person) => {

      let temp = [];
  // const docs = await Personality.find({ owner: person.owner }).select('name url').lean().exec();
      let a = getPersonObject(person).then((data) => {
        let a = temp.concat(data);
        return a;
      });
      console.log(temp);
      a.then((data) => {
        temp = temp.concat(data);
      });
    }); */

    // console.log(temp);

    /* for (const person of people) {
      const docs = await Personality.find({ owner: person.owner }).select('name url').lean().exec();
      // const docs = getPersonObject(person);
      temp = temp.concat(docs);
      // console.log(docs);
    } */

    // console.log(docs);
    // return res.json({ ps: obj });

    /* for(let p of person){
      console.log(p.owner);
      const temp = await Personality.find(p.owner).select('name url').lean().exec();
      docs += temp;
    } */
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
  view,
};
