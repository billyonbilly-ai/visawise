import Image from "next/image";

export default function DemoSection() {
  return (
    <div className="px-3 pb-12 min-[1200px]:px-38 lg:pb-24">
      <div className="card-shadow rounded-2xl bg-neutral-100 p-1.5">
        <div className="min-[764px]:hidden">
          <Image
            src="/dashboard-mobile.png"
            alt="Visawise dashboard mobile"
            width={800}
            height={1000}
            className="card-shadow h-auto w-full rounded-xl"
            priority
          />
        </div>

        <div className="hidden min-[764px]:block">
          <Image
            src="/dashboard-desktop.png"
            alt="Visawise dashboard desktop"
            width={1400}
            height={900}
            className="card-shadow h-auto w-full rounded-xl"
            priority
          />
        </div>
      </div>
    </div>
  );
}
