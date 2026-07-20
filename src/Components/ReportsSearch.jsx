import { MagnifyingGlassIcon } from "@phosphor-icons/react";

function ReportsSearch({ searchText, onSearchChange }) {
  return (
    <section className="panel-card reports-panel-card reports-search-panel">
      <h2 className="reports-panel-title">Search</h2>
      <label className="search-label" htmlFor="reportSearch">
        Search Reports
      </label>

      <div className="search-input-wrapper">
        <MagnifyingGlassIcon className="search-icon" size={18} />
        <input
          id="reportSearch"
          type="text"
          placeholder="Search by title or ID"
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
    </section>
  );
}

export default ReportsSearch;
