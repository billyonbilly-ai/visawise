import Image from "next/image";

export default function DemoSection() {
  return (
    <div className="px-3 pb-12 min-[1200px]:px-38 lg:pb-24">
      <div className="card-shadow rounded-2xl bg-neutral-100 p-1.5">
        <Image
          src="/dashboard.png"
          alt="Visawise dashboard"
          width={1400}
          height={900}
          className="card-shadow h-auto w-full rounded-xl"
          priority
        />
      </div>
    </div>
  );
}
