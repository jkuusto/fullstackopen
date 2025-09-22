import axios from "axios";

const weatherBaseUrl = "https://api.openweathermap.org/data/2.5/weather";
const api_key = import.meta.env.VITE_WEATHER_API_KEY;

const getWeatherByCity = (city) => {
  const request = axios.get(
    `${weatherBaseUrl}?q=${city}&appid=${api_key}&units=metric`
  );
  return request.then((response) => response.data);
};

export default { getWeatherByCity };
