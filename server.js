require('dotenv').config();

const csvParser = require('csv-parser')
const fs = require('fs')
const express = require('express')
const mongoose = require('mongoose')
const Event = require('./models/Event')
const fetch = require('node-fetch')

const app = express()
app.use(express.static('client'))

//Database connectivity
mongoose.connect(process.env.DATABASE_URL)

app.use(express.json())

//CSV parsing and data import
Event.countDocuments()
  .then(count => {
    if (count === 0) {
      fs.createReadStream('events.csv')
        .pipe(csvParser())
        .on('data', (row) => {
          const event = new Event(row)
          event.save()
        })
        .on('end', () => {
          console.log('CSV file successfully processed and data imported into database')
        });
    } else {
      console.log('Database already contains data. Skipping import.')
    }
  })
  .catch(err => {
    console.error('Error checking database:', err)
  });

//fetching Weather API
async function fetchWeather(city, date) {
  const url = `https://gg-backend-assignment.azurewebsites.net/api/Weather?code=KfQnTWHJbg1giyB_Q9Ih3Xu3L9QOBDTuU5zwqVikZepCAzFut3rqsg==&city=${city}&date=${date}`
  const response = await fetch(url)
  const weatherData = await response.json()
  return weatherData
}

//Distance calculation API
async function calculateDistance(userLat, userLng, eventLat, eventLng) {
  const url = `https://gg-backend-assignment.azurewebsites.net/api/Distance?code=IAKvV2EvJa6Z6dEIUqqd7yGAu7IZ8gaH-a0QO6btjRc1AzFu8Y3IcQ==&latitude1=${userLat}&longitude1=${userLng}&latitude2=${eventLat}&longitude2=${eventLng}`
  const response = await fetch(url)
  const distanceData = await response.json()
  return distanceData
}

//Events API
app.get('/events/find', async (req, res) => {
  const { latitude, longitude, date, page } = req.query
  const pageSize = 10
  const skip = (page - 1) * pageSize

  try {
    const startDate = new Date(date)
    const endDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000)

    const events = await Event.find({
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 }).skip(skip).limit(pageSize)

    const results = []
    const promises = events.map(async (event) => {
      const dateString = event.date.toISOString()
      const dateParts = dateString.split("T")
      const datetrue = dateParts[0];

      //Fetching weather and distance data in parallel
      const [weatherData, distanceData] = await Promise.all([
        fetchWeather(event.city_name, datetrue),
        calculateDistance(latitude, longitude, event.latitude, event.longitude)
      ]);

      results.push({
        event_name: event.event_name,
        city_name: event.city_name,
        date: datetrue,
        weather: weatherData.weather,
        distance: distanceData.distance
      });
    });

    await Promise.all(promises)

    const totalEvents = await Event.countDocuments({
      date: { $gte: startDate, $lte: endDate }
    });
    const totalPages = Math.ceil(totalEvents / pageSize)
    const response = {
      events: results,
      page: parseInt(page) || 1,
      pageSize: pageSize,
      totalEvents: totalEvents,
      totalPages: totalPages
    };

    res.json(response)
  } catch (error) {
    console.error('Error fetching events:', error)
    res.status(500).json({ message: 'An error occurred while fetching events.' })
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
});
