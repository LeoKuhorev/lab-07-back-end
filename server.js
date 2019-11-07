'use strict';

// Load Environment veriable from the .env
require('dotenv').config();

// Declare Application Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

// Application setup
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

// API routes
app.get('/', (req, res) => {
  res.send(`This is a back-end application that's meant to be used with city explorer front-end`);
});

app.get('/location', (req, res) => {
  try {
    const geoData = require('./data/geo.json');
    const city = req.query.data;
    const locationData = new Location(city, geoData);
    res.send(locationData);
  }
  catch(error) {
    // Some function or error message
    errorHandler('Sorry, something went wrong', req, res);
  }
});

app.get('/weather', (req, res) => {
  try {
    const weatherData = require('./data/darksky.json');
    const forecastData = getWeather(weatherData);
    res.send(forecastData);
  }
  catch(error) {
    errorHandler('Sorry, something went wrong', req, res);
  }
});

app.get('*', (req, res) => {
  res.status(404).send('No such page');
});


// Helper functions
function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}

function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0,15);
}

function getWeather(weatherData) {
  const result = [];
  weatherData.daily.data.forEach(element =>
    result.push (new Weather (element)));
  return result;
}

function errorHandler (error, req, res) {
  res.status(500).send(error);
}


// Ensure that the server is listening for requests
// THIS MUST BE AT THE BOTTOM OF THE FILE
app.listen(PORT, () => console.log(`The server is up listening on ${PORT}`));
