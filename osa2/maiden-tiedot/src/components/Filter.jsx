const Filter = ({ filter, handleFilterChange }) => {
  return (
    <section>
      find countries <input value={filter} onChange={handleFilterChange} />
    </section>
  );
};

export default Filter;
