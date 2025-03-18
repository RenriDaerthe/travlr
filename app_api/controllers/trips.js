const mongoose = require('mongoose');
const Trip = mongoose.model('Trip');
const User = mongoose.model('users');

// Method to retrieve all trips
const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find();
    res.status(200).json(trips);
  } catch (err) {
    console.error('Error fetching trips:', err);
    res.status(500).json({ message: 'Error retrieving trips' });
  }
};

// Method to retrieve a single trip by code
const getTripByCode = async (req, res) => {
  try {
    const trip = await Trip.findOne({ code: req.params.code });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.status(200).json(trip);
  } catch (err) {
    console.error('Error fetching trip by code:', err);
    res.status(500).json({ message: 'Error retrieving trip' });
  }
};

// Method to add a new trip
const tripsAddTrip = async (req, res) => {
  getUser(req, res, (req, res) => {
    Trip.create({
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start,
      resort: req.body.resort,
      perPerson: req.body.perPerson,
      image: req.body.image,
      description: req.body.description
    }, (err, trip) => {
      if (err) {
        return res.status(400).json(err); // bad request
      } else {
        return res.status(201).json(trip); // created
      }
    });
  });
};

// Method to update an existing trip
const tripsUpdateTrip = async (req, res) => {
  getUser(req, res, (req, res) => {
    Trip.findOneAndUpdate(
      { code: req.params.tripCode },
      {
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
      },
      { new: true }
    )
    .then(trip => {
      if (!trip) {
        return res.status(404).send({
          message: "Trip not found with code " + req.params.tripCode
        });
      }
      res.send(trip);
    })
    .catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "Trip not found with code " + req.params.tripCode
        });
      }
      return res.status(500).json(err); // server error
    });
  });
};

const getUser = (req, res, callback) => {
  if (req.payload && req.payload.email) {
    User.findOne({ email: req.payload.email })
      .exec((err, user) => {
        if (!user) {
          return res.status(404).json({ "message": "User not found" });
        } else if (err) {
          console.error(err);
          return res.status(404).json(err);
        }
        callback(req, res, user.name);
      });
  } else {
    return res.status(404).json({ "message": "User not found" });
  }
};

module.exports = {
  getTrips,
  getTripByCode,
  tripsAddTrip,
  tripsUpdateTrip,
  getUser
};