const renderTravelPage = (req, res) => {
    res.render('travel', { title: 'Travel' }); // Render the travel.hbs file
};

module.exports = {
    renderTravelPage
};
