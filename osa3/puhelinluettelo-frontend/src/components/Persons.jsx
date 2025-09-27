const Persons = ({ persons, deletePerson }) => {
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

export default Persons;
