export const Filter = ({ filter, handleFilterChange }) => {
  return (
    <section>
      filter shown with <input value={filter} onChange={handleFilterChange} />
    </section>
  );
};

export const PersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => {
  return (
    <section>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </section>
  );
};

export const Persons = ({ persons, deletePerson }) => {
  return (
    <section>
      {persons.map((person) => (
        <p key={person.name}>
          {person.name} {person.number}{" "}
          <button onClick={() => deletePerson(person.id)}>delete</button>
        </p>
      ))}
    </section>
  );
};
