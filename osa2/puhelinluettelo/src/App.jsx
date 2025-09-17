import axios from "axios";
import { Filter, PersonForm, Persons } from "./components/Persons";
import { useState, useEffect } from "react";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/persons")
      .then((response) => setPersons(response.data));
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    if (
      persons.some(
        (person) => person.name.toLowerCase() === newName.toLowerCase()
      )
    ) {
      alert(`${newName} is already added to phonebook`);
      return;
    }
    const personObject = {
      name: newName,
      number: newNumber,
    };
    setPersons(persons.concat(personObject));
    setNewName("");
    setNewNumber("");
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  const showAll = newFilter === "";

  const personsToShow = showAll
    ? persons
    : persons.filter((person) =>
        person.name.toLowerCase().includes(newFilter.toLowerCase())
      );

  return (
    <main>
      <h2>Phonebook</h2>

      <Filter filter={newFilter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons persons={personsToShow} />
    </main>
  );
};

export default App;
