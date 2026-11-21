export default function ErrorMessage({ message, details, onRetry }) {
  if (!message) {
    return null;
  }

  const items = Array.isArray(details) ? details.filter((item) => item && item.message) : [];

  return (
    <div className="message" role="alert">
      <p>{message}</p>
      {items.length > 0 && (
        <ul>
          {items.map((item, index) => (
            <li key={`${item.field || "field"}-${index}`}>
              {item.field ? `${item.field}: ${item.message}` : item.message}
            </li>
          ))}
        </ul>
      )}
      {onRetry && (
        <button type="button" className="button button-secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
