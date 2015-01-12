//Server-side

exports.renderCalendarPage = function(req, res) {
    res.render('calendar', { title: 'Calendar' });
};