const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API для получения погоды по координатам
app.get('/api/weather', async (req, res) => {
  try {
    const { lat, lon, city } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Необходимы координаты (lat, lon)' });
    }

    // Используем Open-Meteo API (бесплатный, без ключа)
    const weatherResponse = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=auto`
    );

    const weatherData = weatherResponse.data.current;
    
    // Преобразуем код погоды в описание
    const weatherDescriptions = {
      0: 'Ясно',
      1: 'Преимущественно ясно',
      2: 'Переменная облачность',
      3: 'Пасмурно',
      45: 'Туман',
      48: 'Туман с изморозью',
      51: 'Легкая морось',
      53: 'Морось',
      55: 'Сильная морось',
      61: 'Небольшой дождь',
      63: 'Дождь',
      65: 'Сильный дождь',
      71: 'Небольшой снег',
      73: 'Снег',
      75: 'Сильный снег',
      77: 'Снежная крупа',
      80: 'Ливень',
      81: 'Сильный ливень',
      82: 'Очень сильный ливень',
      85: 'Снегопад',
      86: 'Сильный снегопад',
      95: 'Гроза',
      96: 'Гроза с градом',
      99: 'Гроза с сильным градом'
    };

    const response = {
      city: city || 'Неизвестно',
      temperature: Math.round(weatherData.temperature_2m),
      feelsLike: Math.round(weatherData.apparent_temperature),
      humidity: weatherData.relative_humidity_2m,
      windSpeed: Math.round(weatherData.wind_speed_10m),
      precipitation: weatherData.precipitation,
      description: weatherDescriptions[weatherData.weather_code] || 'Неизвестно',
      weatherCode: weatherData.weather_code,
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error) {
    console.error('Ошибка при получении погоды:', error.message);
    res.status(500).json({ error: 'Не удалось получить данные о погоде' });
  }
});

// API для получения координат по названию города
app.get('/api/geocode', async (req, res) => {
  try {
    const { city } = req.query;
    
    if (!city) {
      return res.status(400).json({ error: 'Необходимо название города' });
    }

    const geocodeResponse = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ru&format=json`
    );

    if (!geocodeResponse.data.results || geocodeResponse.data.results.length === 0) {
      return res.status(404).json({ error: 'Город не найден' });
    }

    const result = geocodeResponse.data.results[0];
    
    res.json({
      name: result.name,
      country: result.country,
      lat: result.latitude,
      lon: result.longitude
    });
  } catch (error) {
    console.error('Ошибка при поиске города:', error.message);
    res.status(500).json({ error: 'Не удалось найти город' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
