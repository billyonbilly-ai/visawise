export default function FormAlert({ message }) {
  if (!message) return null;

  const isSuccess = message.toLowerCase().includes("resent");
  const styles = isSuccess
    ? "border-brand-green/20 bg-brand-green/5 text-brand-green"
    : "border-red-200 bg-red-50 text-red-600";

  return (
    <div className={`rounded-md border px-4 py-3 text-sm ${styles}`}>
      {message}
    </div>
  );
}
