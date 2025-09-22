const Countries = ({
  countries,
  selectedCountry,
  onCountrySelect,
  weatherData,
}) => {
  const showCountryDetails = (country) => {
    const languages = Object.values(country.languages);

    return (
      <section>
        <h1>{country.name.common}</h1>
        <p>Capital {country.capital}</p>
        <p>Area {country.area}</p>
        <h2>Languages</h2>
        <ul>
          {languages.map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <img src={country.flags.png} />
        <h2>Weather in {country.capital}</h2>
        {weatherData ? (
          <>
            <p>Temperature {weatherData.main.temp} Celsius</p>
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt={weatherData.weather[0].description}
            />
            <p>Wind {weatherData.wind.speed} m/s</p>
          </>
        ) : (
          <p>Loading weather data...</p>
        )}
      </section>
    );
  };

  if (countries.length === 0) {
    return null;
  }

  if (countries.length > 10) {
    return (
      <section>
        <p>Too many matches, specify another filter</p>
      </section>
    );
  }

  if (countries.length === 1 || selectedCountry) {
    const countryToShow = selectedCountry || countries[0];
    return showCountryDetails(countryToShow);
  }

  return (
    <section>
      {countries.map((country) => (
        <p key={country.name.common}>
          {country.name.common}{" "}
          <button onClick={() => onCountrySelect(country)}>Show</button>
        </p>
      ))}
    </section>
  );
};

export default Countries;
