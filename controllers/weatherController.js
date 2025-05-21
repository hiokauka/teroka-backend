const axios = require('axios');

const apiKey = process.env.OPENWEATHER_API_KEY;

exports.getWeather = async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'City is required' });

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);

    res.json({
      city: response.data.name,
      country: response.data.sys.country,
      coordinates: response.data.coord,
      temperature: response.data.main.temp,
      feels_like: response.data.main.feels_like,
      temp_min: response.data.main.temp_min,
      temp_max: response.data.main.temp_max,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      wind_speed: response.data.wind.speed,
      wind_deg: response.data.wind.deg,
      clouds: response.data.clouds.all,
      visibility: response.data.visibility,
      sunrise: response.data.sys.sunrise,
      sunset: response.data.sys.sunset,
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
};

exports.getForecast = async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'City is required' });

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);

    const forecastData = response.data.list;

    // Group and filter data to get daily forecasts (every 24h)
    const dailyForecasts = forecastData.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 3);

    const forecast = dailyForecasts.map(item => ({
      date: item.dt_txt,
      temp_max: item.main.temp_max,
      description: item.weather[0].description,
      icon: item.weather[0].icon
    }));

    res.json({ forecast });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
};
