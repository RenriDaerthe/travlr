const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const Trip = require('./travlr'); // Import the trips model

// MongoDB connection
const dbURI = 'mongodb://127.0.0.1/travlr';
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Log connection status
mongoose.connect(dbURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));
;

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error: ', err);
});

// Read `trips.json` file
const tripsFilePath = path.join(__dirname, '../../data/trips.json');
const tripsData = JSON.parse(fs.readFileSync(tripsFilePath, 'utf8'));

// Clear and seed the `trips` collection
const seedTrips = async () => {
    try {
        // Clear existing trips
        await Trip.deleteMany({});
        console.log('Existing trips cleared.');

        // Insert new trips
        await Trip.insertMany(tripsData);
        console.log('Trips seeded successfully.');

        // Disconnect from database
        mongoose.connection.close();
    } catch (err) {
        console.error('Error seeding trips:', err);
        mongoose.connection.close();
    }
};

// Run the seed function
seedTrips();
