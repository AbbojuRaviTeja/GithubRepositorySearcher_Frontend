import { LANGUAGES, SORT_OPTIONS } from "../utils/options";

export default function FilterPanel({ draft, onChange, onSubmit, disabled }) {
  return (
    <form className="panel filter-form" onSubmit={onSubmit}>
      <label className="field">
        <span>Language</span>
        <input
          name="language"
          type="text"
          list="saved-languages"
          value={draft.language}
          maxLength={64}
          autoComplete="off"
          placeholder="Java"
          onChange={(event) => onChange("language", event.target.value)}
        />
        <datalist id="saved-languages">
          {LANGUAGES.map((language) => (
            <option key={language} value={language} />
          ))}
        </datalist>
      </label>
      <label className="field">
        <span>Minimum stars</span>
        <input
          name="minStars"
          type="text"
          inputMode="numeric"
          value={draft.minStars}
          autoComplete="off"
          placeholder="0"
          onChange={(event) => onChange("minStars", event.target.value)}
        />
      </label>
      <label className="field">
        <span>Minimum forks</span>
        <input
          name="minForks"
          type="text"
          inputMode="numeric"
          value={draft.minForks}
          autoComplete="off"
          placeholder="0"
          onChange={(event) => onChange("minForks", event.target.value)}
        />
      </label>
      <label className="field">
        <span>Updated from</span>
        <input
          name="updatedFrom"
          type="date"
          value={draft.updatedFrom}
          onChange={(event) => onChange("updatedFrom", event.target.value)}
        />
      </label>
      <label className="field">
        <span>Updated to</span>
        <input
          name="updatedTo"
          type="date"
          value={draft.updatedTo}
          onChange={(event) => onChange("updatedTo", event.target.value)}
        />
      </label>
      <label className="field">
        <span>Sort</span>
        <select
          name="sort"
          value={draft.sort}
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
          Apply
        </button>
      </div>
      <p className="hint field-wide">
        Language matches the stored name exactly, ignoring case. Dates use the repository update day in UTC.
      </p>
    </form>
  );
}
