export default function OtpInput({
  otp,
  otpRefs,
  onChange,
  onKeyDown,
  onPaste,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-brand-black text-sm font-semibold">
        Verification code
      </label>
      <div className="flex justify-between gap-2" onPaste={onPaste}>
        {otp.map((data, index) => (
          <input
            key={index}
            ref={(el) => (otpRefs.current[index] = el)}
            type="text"
            maxLength={1}
            className="input-base h-12 w-full px-0 text-center text-lg font-bold"
            value={data}
            onChange={(e) => onChange(e.target, index)}
            onKeyDown={(e) => onKeyDown(e, index)}
          />
        ))}
      </div>
    </div>
  );
}
