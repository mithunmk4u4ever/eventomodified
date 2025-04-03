import React, { useState } from "react";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    if (!city) return;
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=6aebfb7994ee47a28f771354250204&q=${city}`
      );
      const data = await response.json();
      if (response.ok) {
        setWeather(data);
        setError(null);
      } else {
        setError(data.error.message);
        setWeather(null);
      }
    } catch (err) {
      setError("Failed to fetch weather data.");
      setWeather(null);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Weather App</h2>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchWeather}>Get Weather</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div>
          <h3>{weather.location.name}, {weather.location.country}</h3>
          <p>Temperature: {weather.current.temp_c}°C</p>
          <p>Condition: {weather.current.condition.text}</p>
          <img src={weather.current.condition.icon} alt="Weather Icon" />
          <p>Humidity: {weather.current.humidity}%</p>
          <p>Wind Speed: {weather.current.wind_kph} km/h</p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
