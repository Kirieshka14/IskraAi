import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RegistrationLegalNotice } from "@/components/registration-legal-notice";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white md:py-14">
      <div className="mx-auto mb-6 flex max-w-3xl items-center justify-between gap-4">
        <Link
          href="/auth/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-stone-300 transition hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft size={16} />
          К регистрации
        </Link>
        <span className="text-sm font-semibold text-stone-500">IskraAi</span>
      </div>
      <RegistrationLegalNotice full />
    </main>
  );
}
