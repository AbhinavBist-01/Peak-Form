import { ArrowLeft, Home, LogIn } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-5 py-8 text-[#2D2926]">
      <div className="w-full max-w-2xl rounded-2xl border border-[#E5DFD5] bg-[#FFFDF9] p-8 md:p-12 shadow-xs text-center space-y-8">
        <Link href="/" className="inline-flex items-center gap-3">
          <Image
            src="/peakform-logo.svg"
            alt="PeakForms"
            width={36}
            height={36}
            className="size-9 opacity-90"
          />
          <span className="peak-serif text-3xl font-medium tracking-tight text-[#2D2926]">
            PeakForms
          </span>
        </Link>

        <div className="space-y-4">
          <span className="inline-block rounded-full bg-[#F7EBE1] px-3.5 py-1 text-xs font-mono text-[#DA7756] font-medium">
            404 — PAGE NOT FOUND
          </span>
          <h1 className="peak-serif text-4xl font-medium tracking-tight text-[#2D2926] md:text-5xl">
            This form or page does not exist.
          </h1>
          <p className="mx-auto max-w-md text-sm text-[#78726A] leading-relaxed">
            The link you followed may be expired, unlisted, or mistyped.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="claude-button inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#DA7756] px-6 text-xs font-medium text-white hover:bg-[#C66545]"
          >
            <Home className="size-4" />
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E5DFD5] bg-white px-6 text-xs font-medium text-[#2D2926] hover:bg-[#F2ECE1]"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
