import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 max-w-2xl mx-auto px-6 py-16 flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Canadian Tax Prep Navigator
          </h1>
          <p className="text-sm text-gray-400 mb-6">A TaxReady Product</p>
          <div className="flex flex-col gap-4 text-gray-700 text-base leading-relaxed">
            <p>
              This tool guides Ontario residents through a short interview to identify income
              to report, deductions to claim, and credits to apply on their 2025 T1 return.
              Based on your answers, it builds a personalised checklist of tax items and the
              documents you will need before meeting your tax preparer or filing on your own.
            </p>
            <p>
              The interview covers your personal profile, employment income, and other income
              sources. Depending on your situation, additional sections may appear for things
              like self-employment, registered plans, and eligible credits. Most people
              complete the interview in under ten minutes.
            </p>

            {/* Privacy notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 leading-relaxed">
                <span className="font-semibold">Your privacy is protected.</span> This review
                does not collect or store any of your personal information. Please save or
                print your Checklist at the end of the review — it will not be retained once
                you leave the page.
              </p>
            </div>

            {/* Mobile tip */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-semibold">Using a mobile device?</span> For the best
                experience, rotate your phone to landscape orientation before you begin.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Link
            href="/interview"
            className="w-full max-w-xs text-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-semibold"
          >
            Start Your 2025 Tax Review
          </Link>
        </div>

        {/* Disclaimer — below button */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
          <p className="text-sm font-semibold text-yellow-800 mb-2">Disclaimer</p>
          <p className="text-sm text-yellow-900 leading-relaxed">
            This tool is for informational purposes only and does not constitute tax advice.
            Please consult a qualified tax professional before filing your return. Results are
            based solely on your answers and may not reflect your complete tax situation.
          </p>
        </div>
      </main>
    </div>
  );
}
