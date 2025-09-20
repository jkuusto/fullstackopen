import Filter from "./components/Filter";
import Countries from "./components/Countries";
import { useState, useEffect } from "react";
import countryService from "./services/countryservice";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);

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

  return (
    <main>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <Countries
        countries={filteredCountries}
        selectedCountry={selectedCountry}
        onCountrySelect={handleCountrySelect}
      />
    </main>
  );
};

export default App;
