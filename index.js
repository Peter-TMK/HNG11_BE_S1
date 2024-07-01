require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3333;
app.use(express.json());

function getClientIp(req) {
  // Extract the IP address from the 'x-forwarded-for' header or socket remote address
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  // Convert IPv6-mapped IPv4 address to IPv4 address
  return ip && ip.startsWith("::ffff:") ? ip.slice(7) : ip;
}

app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name;
  const clientIp = getClientIp(req);

  try {
    // For demonstration, we'll use a default lat/lon (e.g., New York)
    // In a real-world application, you'd get these from the IP address.
    const lat = req.query.latitude || 40.7128;
    const lon = req.query.longitude || -74.006;

    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      //   `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`,
      //   `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}`,
      //   `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat={lat}&lon={lon}&dt={time}&appid={API key}`,
      //   `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat={lat}&lon={lon}&appid={process.env.OPENWEATHER_API_KEY}`
      {
        params: {
          lat: lat,
          lon: lon,
          units: "metric",
          appid: process.env.OPENWEATHER_API_KEY,
        },
      }
    );
    // console.log(weatherResponse.data);
    const {
      name: city,
      main: { temp: temperature },
    } = weatherResponse.data;
    const data = {
      client_ip: clientIp,
      location: city,
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`,
    };
    console.log(data);
    res.json(data);
  } catch (error) {
    res.status(500).send("Error retrieving data");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/**
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3333;
app.use(express.json());

// Function to get client's IP address
function getClientIp(req) {
  // return req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  // Extract the IP address from the 'x-forwarded-for' header or socket remote address
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  // Convert IPv6-mapped IPv4 address to IPv4 address
  return ip && ip.startsWith("::ffff:") ? ip.slice(7) : ip;
}

// Function to get weather data using WeatherAPI
async function getWeatherData(lat, lon) {
  const apiKey = process.env.WEATHERAPI_KEY;
  const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

  try {
    const response = await axios.get(weatherUrl);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to retrieve weather data");
  }
}

// Function to get geolocation data using WeatherAPI
async function getGeolocation(ip) {
  const apiKey = process.env.WEATHERAPI_KEY;
  const geoUrl = `https://api.weatherapi.com/v1/ip.json?key=${apiKey}&q=${ip}`;

  try {
    const response = await axios.get(geoUrl);
    return response.data;
  } catch (error) {
    // console.log(error);
    throw new Error("Failed to retrieve geolocation data");
  }
}

app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name || "Guest";
  const clientIp = getClientIp(req);
  // console.log(visitorName);

  try {
    // Get geolocation data from client's IP address
    const geoData = await getGeolocation(clientIp);
    console.log(geoData.location);
    const { lat, lon, city } = geoData.location;

    // Get weather data for the obtained latitude and longitude
    const weatherData = await getWeatherData(lat, lon);
    const { temp_c: temperature } = weatherData.current;

    res.json({
      client_ip: clientIp,
      location: city,
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

*/

/**
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3333;

function getClientIp(req) {
  // Extract the IP address from the 'x-forwarded-for' header or socket remote address
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  // Convert IPv6-mapped IPv4 address to IPv4 address
  return ip && ip.startsWith("::ffff:") ? ip.slice(7) : ip;
}

// Function to get location data based on IP address using WeatherAPI
async function getLocationData(ip) {
  const apiKey = process.env.WEATHERAPI_KEY;
  const locationUrl = `https://api.weatherapi.com/v1/ip.json?key=${apiKey}&q=${ip}`;

  try {
    const response = await axios.get(locationUrl);
    console.log(response.data.location);
    const { lat, lon, city } = response.data.location;
    return { lat, lon, city };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to retrieve location data");
  }
}

// Function to get weather data from WeatherAPI
async function getWeatherData(lat, lon) {
  const apiKey = process.env.WEATHERAPI_KEY;
  console.log(apiKey);
  const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

  try {
    const response = await axios.get(weatherUrl);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to retrieve weather data");
  }
}

app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name || "Guest";
  // console.log(req);
  const clientIp = getClientIp(req);
  console.log(typeof clientIp, clientIp);

  try {
    // Get location data from the client's IP address
    const locationData = await getLocationData(clientIp);
    console.log(locationData);
    const { lat, lon, city } = locationData;

    // Get weather data for the obtained latitude and longitude
    const weatherData = await getWeatherData(lat, lon);
    console.log(weatherData);
    const { temp_c: temperature } = weatherData.current;

    res.json({
      client_ip: clientIp,
      location: city,
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
*/

/**
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3333;
app.use(express.json());

function getClientIp(req) {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  return ip && ip.startsWith("::ffff:") ? ip.slice(7) : ip;
}

// Function to get location data based on IP address using ip-api.com
async function getLocationData(ip) {
  const locationUrl = `http://ip-api.com/json/${ip}`;

  try {
    const response = await axios.get(locationUrl);
    const { lat, lon, city } = response.data;
    return { lat, lon, city };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to retrieve location data");
  }
}

// Function to get weather data from WeatherAPI
async function getWeatherData(lat, lon) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

  try {
    const response = await axios.get(weatherUrl);
    return response.data;
  } catch (error) {
    // console.log(error);
    throw new Error("Failed to retrieve weather data");
  }
}

app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name || "Guest";
  const clientIp = getClientIp(req);

  try {
    // Get location data from the client's IP address
    const locationData = await getLocationData(clientIp);
    console.log(locationData);
    const { lat, lon, city } = locationData;

    // Get weather data for the obtained latitude and longitude
    const weatherData = await getWeatherData(lat, lon);
    const { temp_c: temperature } = weatherData.current;

    res.json({
      client_ip: clientIp,
      location: city,
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
*/
