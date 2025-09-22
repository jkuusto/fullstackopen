import Filter from "./components/Filter";
import Countries from "./components/Countries";
import { useState, useEffect } from "react";
import countryService from "./services/countryservice";
import weatherService from "./services/weatherservice";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    countryService
      .getAll()
      .then((initialCountries) => setCountries(initialCountries));
  }, []);

  useEffect(() => {
    setSelectedCountry(null);
  }, [filter]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };

  const filteredCountries =
    filter === ""
      ? []
      : countries.filter((country) =>
          country.name.common.toLowerCase().includes(filter.toLowerCase())
        );

  const displayedCountry =
    selectedCountry ||
    (filteredCountries.length === 1 ? filteredCountries[0] : null);

  useEffect(() => {
    if (displayedCountry) {
      weatherService
        .getWeatherByCity(displayedCountry.capital[0])
        .then((weatherData) => {
          setWeatherData(weatherData);
        });
    }
  }, [displayedCountry]);

  return (
    <main>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <Countries
        countries={filteredCountries}
        selectedCountry={selectedCountry}
        onCountrySelect={handleCountrySelect}
        weatherData={weatherData}
      />
    </main>
  );
};

export default App;
