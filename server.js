'use strict';

// Load Environment veriable from the .env
require('dotenv').config();

// Declare Application Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const path = require('path');

// Application setup
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

// API routes

// serve static folder
app.use(express.static(path.join(__dirname, 'public')));

// Specifing the routes
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('*', (req, res) => {
  res.status(404).send('No such page');
});


// Helper functions

// location constructor
function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}

// weather constructor
function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0,15);
}


// Event Handlers
function locationHandler (req, res) {
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
}

function weatherHandler(req, res) {
  try {
    const weatherData = require('./data/darksky.json');
    const forecastData =   weatherData.daily.data.map(element => new Weather (element));
    res.send(forecastData);
  }
  catch(error) {
    errorHandler('Sorry, something went wrong', req, res);
  }
}


function errorHandler (error, req, res) {
  res.status(500).send(error);
}


// Ensure that the server is listening for requests
// THIS MUST BE AT THE BOTTOM OF THE FILE
app.listen(PORT, () => console.log(`The server is up listening on ${PORT}`));
