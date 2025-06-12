import "../styles/index.css"

function FilterBar({ filterText, setFilterText }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Filter by sender"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{ padding: '8px', fontSize: '14px', width: '250px', borderRadius: '5px', border: '1px solid #ccc' }}
      />
    </div>
  );
}

export default FilterBar;
