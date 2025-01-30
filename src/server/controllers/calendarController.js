const { authorize } = require('../services/googleAuthService');
const {google} = require('googleapis');

exports.getCalendarEvents = async (req, res) => {
  try {
    const client = await authorize();
    const calendar = google.calendar({ version: 'v3', auth: client });

    // Now you can call Google Calendar APIs
    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
    });
    
    res.json(events.data);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};