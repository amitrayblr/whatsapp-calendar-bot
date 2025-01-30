const { authorize } = require('../services/googleAuthService')
const {google} = require('googleapis');
const moment = require('moment');

exports.getCalendarEvents = async (req, res) => {
  try {
    const client = await authorize();
    const calendar = google.calendar({ version: 'v3', auth: client })
    // const { startOfWeek, endOfWeek } = getWeekRange();

    const startOfWeek = moment().startOf('week');
    const endOfWeek = moment().endOf('week'); 

    const resEvents = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startOfWeek.toISOString(),
      timeMax: endOfWeek.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });
    const events = resEvents.data.items || []

    console.log('Events', events)
    res.json('Receiving events data')
  } catch (error) {
    console.error('Error fetching calendar events:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
};
