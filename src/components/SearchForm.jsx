import { LANGUAGES, SORT_OPTIONS } from "../utils/options";

export default function SearchForm({ values, onChange, onSubmit, disabled }) {
  return (
    <form className="panel search-form" onSubmit={onSubmit} aria-busy={disabled}>
      <label className="field field-wide">
        <span>Keyword</span>
        <input
          name="query"
          type="text"
          value={values.query}
          maxLength={256}
          autoComplete="off"
          placeholder="spring boot"
          onChange={(event) => onChange("query", event.target.value)}
        />
      </label>
      <label className="field">
        <span>Language</span>
        <input
          name="language"
          type="text"
          list="search-languages"
          value={values.language}
          maxLength={64}
          autoComplete="off"
          placeholder="Any language"
          onChange={(event) => onChange("language", event.target.value)}
        />
        <datalist id="search-languages">
          {LANGUAGES.map((language) => (
            <option key={language} value={language} />
          ))}
        </datalist>
      </label>
      <label className="field">
        <span>Sort</span>
        <select
          name="sort"
          value={values.sort}
          onChange={(event) => onChange("sort", event.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <div className="form-actions">
        <button className="button" type="submit" disabled={disabled}>
          {disabled ? "Searching…" : "Search"}
        </button>
      </div>
    </form>
  );
}
