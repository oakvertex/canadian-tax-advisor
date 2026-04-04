import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 max-w-2xl mx-auto px-6 py-16 flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Canadian Personal Tax Advisor
          </h1>
          <div className="flex flex-col gap-4 text-gray-700 text-base leading-relaxed">
            <p>
              This tool guides Ontario residents through a brief interview to identify income
              items to report, deductions to claim, and credits to apply on their 2025 T1
              return. Based on your answers, it builds a personalized checklist of tax items
              and the documents you need to gather before meeting your tax preparer or filing
              on your own.
            </p>
            <p>
              The interview covers your personal profile, employment income, and other income
              sources. Depending on your situation, additional sections may appear for things
              like self-employment, registered plans, and eligible credits. Most people
              complete the interview in under ten minutes.
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
          <p className="text-sm font-semibold text-yellow-800 mb-2">Disclaimer</p>
          <p className="text-sm text-yellow-900 leading-relaxed">
            This tool is for informational purposes only. It does not constitute tax advice.
            Always consult a qualified tax professional before filing your return. Results are
            based on your answers and may not reflect your complete tax situation.
          </p>
        </div>

        <Link
          href="/interview"
          className="self-start px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-semibold"
        >
          Start Your 2025 Tax Review
        </Link>
      </main>
    </div>
  );
}
