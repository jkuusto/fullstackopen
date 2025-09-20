const Countries = ({ countries, selectedCountry, onCountrySelect }) => {
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
