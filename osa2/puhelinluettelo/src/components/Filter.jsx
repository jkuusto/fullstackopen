const Filter = ({ filter, handleFilterChange }) => {
  return (
    <section>
      filter shown with <input value={filter} onChange={handleFilterChange} />
    </section>
  );
};

export default Filter;
