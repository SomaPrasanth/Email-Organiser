import React from 'react';

function FilterBar({ filterText, setFilterText, showSpamOnly, setShowSpamOnly }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Search by sender"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{ padding: '8px', fontSize: '14px', width: '250px', marginRight: '10px' }}
      />
      <label>
        <input
          type="checkbox"
          checked={showSpamOnly}
          onChange={(e) => setShowSpamOnly(e.target.checked)}
          
        />
        Show only spam
      </label>
    </div>
  );
}

export default FilterBar;
