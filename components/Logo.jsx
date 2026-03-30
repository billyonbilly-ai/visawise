import Link from "next/link";
import PlaneIcon from "./icons/PlaneIcon";

export default function Logo({ href = "/" }) {
  return (
    <Link href={href} className="flex items-center gap-1">
      <div className="bg-brand-black flex items-center justify-center rounded-full p-2">
        <PlaneIcon className="h-6.5 w-6.5 text-white" />
      </div>
      <p className="font-bold">Visawise</p>
    </Link>
  );
}
