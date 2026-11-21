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
        Language matches the stored name exactly, ignoring case. Minimum stars is inclusive.
      </p>
    </form>
  );
}
