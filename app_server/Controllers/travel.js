const axios = require('axios'); // Import axios for API calls

// Render the travel page
const renderTravelPage = async (req, res) => {
    try {
        // Fetch trip data from the API
        const response = await axios.get('http://localhost:3000/api/trips');
        const trips = response.data;

        // Render the travel.hbs file and pass the trips data
        res.render('travel', { title: 'Travel', trips });
    } catch (err) {
        console.error('Error fetching trips:', err);
        res.render('error', { message: 'Unable to fetch trips', error: err });
    }
};

module.exports = {
    renderTravelPage
};
