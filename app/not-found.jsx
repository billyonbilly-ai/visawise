import Link from "next/link";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="mb-8">
        <Logo href="/" />
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
        404
      </h1>

      <p className="mt-4 mb-10 max-w-sm text-lg text-neutral-500">
        The page you are looking for doesn't exist or has been moved.
      </p>

      <Link href="/" className="block w-max">
        <Button type="outline">Back to home</Button>
      </Link>
    </main>
  );
}
