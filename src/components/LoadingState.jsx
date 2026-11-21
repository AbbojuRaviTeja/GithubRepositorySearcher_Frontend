export default function LoadingState({ label }) {
  return (
    <p className="loading" role="status">
      {label}
    </p>
  );
}
