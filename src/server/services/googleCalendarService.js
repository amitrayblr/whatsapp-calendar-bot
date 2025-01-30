const moment = require('moment')
const { google } = require('googleapis')
const { authorize } = require('./googleAuthService')

// Main function to get weekly schedule
async function getWeeklySchedule() {
  try {
    // Authorize Google API client
    const client = await authorize()
    const calendar = google.calendar({ version: 'v3', auth: client })

    // Define current week boundaries
    const startOfWeek = moment().startOf('week')
    const endOfWeek = moment().endOf('week')

    // Fetch events within this time range
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startOfWeek.toISOString(),
      timeMax: endOfWeek.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    })

    // Group events by day
    const items = response.data.items || []
    const groupedEvents = groupEventsByDay(items)

    // Initialise the empty schedule object
    const weeklySchedule = {}

    // Pointer to iterate over the days in the week range
    let dayPointer = startOfWeek
    while (dayPointer.isSameOrBefore(endOfWeek, 'day')) {
      // Convert day to YYYY-MM-DD format
      const dateKey = dayPointer.format('YYYY-MM-DD')

      // Get the day's events or initialise an empty array for no events
      const dayEvents = groupedEvents[dateKey] || []

      // Extra check to sort events based on start time
      dayEvents.sort((a, b) => a.startTime.valueOf() - b.startTime.valueOf())

      // Calculate free slots based on work hours (9 AM - 5 PM)
      const freeSlots = getFreeSlotsForDay(dateKey, dayEvents, 9, 17)

      // Populate the schedule object 
      weeklySchedule[dateKey] = {
        events: dayEvents.map((event) => ({
          summary: event.summary,
          start: event.startTime.format('LT'),
          end: event.endTime.format('LT'),
        })),
        freeSlots: freeSlots.map((slot) => ({
          start: slot.startTime.format('LT'),
          end: slot.endTime.format('LT'),
        })),
      }

      // Move to the next day
      dayPointer.add(1, 'day')
    }

    // Format data to text
    scheduleMessage = await formatData({
      startOfWeek: startOfWeek.format('YYYY-MM-DD'),
      endOfWeek: endOfWeek.format('YYYY-MM-DD'),
      schedule: weeklySchedule,
    })

    // Return the schedule
    return scheduleMessage
  } catch (error) {
    console.error('Error fetching calendar events:', error)
  }
}

// Helper function to group events on the basis of day
function groupEventsByDay(events) {
  const grouped = {}
  
  // Iterate over each event
  events.forEach((event) => {
    const eventStart = moment(event.start.dateTime || event.start.date)
    const dateKey = eventStart.format('YYYY-MM-DD')

    // Initialise the events array if it doesn't exist
    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }

    // Push the event into the events array
    grouped[dateKey].push({
      summary: event.summary || 'No Summary',
      startTime: moment(event.start.dateTime || event.start.date),
      endTime: moment(event.end.dateTime || event.end.date),
    })
  })

  // Return the grouped events
  return grouped
}

// Helper function to calculate free slots for a day
function getFreeSlotsForDay(dateKey, events, workdayStartHour, workdayEndHour) {
  // Setting start and end of workday
  const dayStart = moment(dateKey).hour(workdayStartHour).minute(0).second(0).millisecond(0)
  const dayEnd = moment(dateKey).hour(workdayEndHour).minute(0).second(0).millisecond(0)

  // Initialise the free slots array
  const freeSlots = []

  // Pointer to iterate through the day
  let timePointer = dayStart

  // Iterate over each event
  for (const event of events) {
    // Add a slot if event starts after the pointer
    if (event.startTime.isAfter(timePointer)) {
      freeSlots.push({ startTime: timePointer, endTime: event.startTime })
    }

    // Move the pointer to the end of the event
    if (event.endTime.isAfter(timePointer)) {
      timePointer = event.endTime
    }
  }

  // Add any remaining slots if done iterating through events
  if (timePointer.isBefore(dayEnd)) {
    freeSlots.push({ startTime: timePointer, endTime: dayEnd })
  }

  // Filter out any slots entirely outside the workday - happens when events end after workday
  return freeSlots.filter((slot) => slot.startTime.isBefore(dayEnd) && slot.endTime.isAfter(dayStart))
}

// Helper method to format data to text
async function formatData(data) {
  const { startOfWeek, endOfWeek, schedule } = data
  let message = `Weekly Schedule (${startOfWeek} - ${endOfWeek}):\n\n`

  // Sort days so they're in ascending date order
  const sortedDates = Object.keys(schedule).sort()

  sortedDates.forEach((dateKey) => {
    const { events, freeSlots } = schedule[dateKey]
    const dayName = moment(dateKey).format('dddd')
    message += `*${dayName} (${dateKey})*\n`

    // List events
    if (events.length > 0) {
      message += `  _Busy:_\n`
      events.forEach((event) => {
        message += `    • ${event.start}-${event.end} ${event.summary}\n`
      })
    } else {
      message += `  No events.\n`
    }

    // List free slots
    if (freeSlots.length > 0) {
      message += `  _Free Slots:_\n`
      freeSlots.forEach((slot) => {
        message += `    • ${slot.start}-${slot.end}\n`
      })
    } else {
      message += `  No free slots.\n`
    }

    message += `\n`
  })

  return message
}

module.exports = { 
  getWeeklySchedule 
}