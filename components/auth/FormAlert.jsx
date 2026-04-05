export default function FormAlert({ message, type }) {
  if (!message) return null;

  const styles = `${type === "success" ? "border-brand-green/20 bg-brand-green/5 text-brand-green" : "border-red-200 bg-red-50 text-red-600"}`;

  return (
    <div className={`rounded-md border px-3 py-2 text-[13px] ${styles}`}>
      {message}
    </div>
  );
}
