import { getCity, spendingPower, percentDelta, fmtMoney, fmtPct, normalizeSlug } from '@/lib/compare';
import { CITIES } from '@/lib/data/cities';
import Link from 'next/link';

export const dynamic = "force-dynamic";

interface BriefPageProps {
  searchParams: {
    a?: string;
    b?: string;
    salary?: string;
  };
}

export default function BriefPage({ searchParams }: BriefPageProps) {
  const { a, b, salary: salaryStr } = searchParams;
  
  if (!a || !b || !salaryStr) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Missing Parameters</h1>
          <p className="text-gray-400 mb-6">Please provide both cities and a salary to generate a brief.</p>
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const salary = parseInt(salaryStr);
  const slugA = normalizeSlug(a);
  const slugB = normalizeSlug(b);
  
  const cityA = getCity(slugA);
  const cityB = getCity(slugB);
  
  if (!cityA || !cityB) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center max-w-2xl px-4">
          <h1 className="text-2xl font-bold mb-4">City Not Found</h1>
          <p className="text-gray-400 mb-6">One or both cities could not be found.</p>
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const spendingData = spendingPower(salary, cityA.rpp, cityB.rpp);
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Calculate key deltas for narrative
  const rentDelta = percentDelta(cityA.rentIndex, cityB.rentIndex);
  const diversityDelta = percentDelta(cityA.diversityIndex, cityB.diversityIndex);
  const cafesDelta = percentDelta(cityA.cafesPer10k, cityB.cafesPer10k);
  const parksDelta = percentDelta(cityA.parksPer10k, cityB.parksPer10k);
  const internetDelta = percentDelta(cityA.internetMbps, cityB.internetMbps);

  // Create narrative based on strongest deltas
  const getLifestyleNarrative = () => {
    const insights = [];
    
    if (Math.abs(rentDelta) > 15) {
      const direction = rentDelta < 0 ? "significantly cheaper" : "notably more expensive";
      insights.push(`Housing costs are ${direction} with a ${Math.abs(rentDelta).toFixed(1)}% difference in rent index`);
    }
    
    if (Math.abs(diversityDelta) > 10) {
      const direction = diversityDelta > 0 ? "more diverse" : "less diverse";
      insights.push(`The community is ${direction} by ${Math.abs(diversityDelta).toFixed(1)}%`);
    }
    
    if (Math.abs(cafesDelta) > 20) {
      const direction = cafesDelta > 0 ? "richer" : "more limited";
      insights.push(`The cafe scene is ${direction} with ${Math.abs(cafesDelta).toFixed(1)}% ${cafesDelta > 0 ? 'more' : 'fewer'} options per capita`);
    }
    
    return insights.slice(0, 3).join('. ') + '.';
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 print:bg-white">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Header - No Print */}
        <div className="print:hidden mb-8 border-b pb-6">
          <Link href={`/compare?a=${slugA}&b=${slugB}&salary=${salary}`} className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Comparison
          </Link>
        </div>

        {/* Brief Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Relocation Brief</h1>
          <h2 className="text-2xl text-gray-600 mb-4">
            {cityA.name}, {cityA.state} → {cityB.name}, {cityB.state}
          </h2>
          <p className="text-gray-500">Generated on {currentDate}</p>
        </div>

        {/* Section 1: Salary & Costs */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
            💰 Salary & Costs
          </h2>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-3">Bottom Line</h3>
            <p className="text-lg leading-relaxed">
              Your {fmtMoney(salary)} salary in {cityA.name} would be equivalent to{' '}
              <strong className="text-blue-700">{fmtMoney(spendingData.destEquivalent)}</strong> in {cityB.name}.
              {spendingData.deltaPct > 5 && (
                <span className="text-green-700"> This means you'd have {fmtPct(spendingData.deltaPct)} more spending power!</span>
              )}
              {spendingData.deltaPct < -5 && (
                <span className="text-red-700"> This means you'd need {fmtPct(Math.abs(spendingData.deltaPct))} more income to maintain the same lifestyle.</span>
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">{cityA.name} Baseline</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>Regional Price Parity: {cityA.rpp}</li>
                <li>Rent Index: {cityA.rentIndex}</li>
                <li>Median Income: {fmtMoney(cityA.incomeMedian)}</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">{cityB.name} Target</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>Regional Price Parity: {cityB.rpp}</li>
                <li>Rent Index: {cityB.rentIndex}</li>
                <li>Median Income: {fmtMoney(cityB.incomeMedian)}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2: Lifestyle & Vibes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
            🌟 Lifestyle & Vibes
          </h2>
          
          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-3">What to Expect</h3>
            <p className="text-lg leading-relaxed">
              Moving from {cityA.name} to {cityB.name} brings notable lifestyle changes. {getLifestyleNarrative()}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Community</h4>
              <p className="text-sm text-gray-600">
                {(cityB.diversityIndex * 100).toFixed(0)}% diversity index
                {Math.abs(diversityDelta) > 5 && (
                  <span className={`block mt-1 ${diversityDelta > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {fmtPct(diversityDelta)} vs {cityA.name}
                  </span>
                )}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Work Setup</h4>
              <p className="text-sm text-gray-600">
                {cityB.internetMbps} Mbps avg speed
                {Math.abs(internetDelta) > 10 && (
                  <span className={`block mt-1 ${internetDelta > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {fmtPct(internetDelta)} vs {cityA.name}
                  </span>
                )}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Climate</h4>
              <p className="text-sm text-gray-600">{cityB.climate}</p>
            </div>
          </div>
        </section>

        {/* Section 3: Neighborhood Starter Pack */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
            🏘️ Neighborhood Starter Pack
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">{cityA.name} - Current</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-semibold">Downtown Core</h4>
                  <p className="text-sm text-gray-600">Urban living with walkable amenities</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-semibold">Historic District</h4>
                  <p className="text-sm text-gray-600">Character homes with local charm</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-semibold">Tech Corridor</h4>
                  <p className="text-sm text-gray-600">Modern developments near business centers</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">{cityB.name} - Target</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <h4 className="font-semibold">City Center</h4>
                  <p className="text-sm text-gray-600">Prime location with urban conveniences</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <h4 className="font-semibold">Arts Quarter</h4>
                  <p className="text-sm text-gray-600">Creative community with cultural venues</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <h4 className="font-semibold">Suburban Edge</h4>
                  <p className="text-sm text-gray-600">Family-friendly with more space</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: First-Week Plan */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
            ✅ First-Week Plan
          </h2>
          
          <div className="bg-yellow-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Essential Checklist</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Before You Move</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <span className="w-4 h-4 border border-gray-400 rounded mr-2"></span>
                    Research neighborhoods online
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 border border-gray-400 rounded mr-2"></span>
                    Contact local real estate agents
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 border border-gray-400 rounded mr-2"></span>
                    Set up mail forwarding
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 border border-gray-400 rounded mr-2"></span>
                    Research local ISP options
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">First Week Tasks</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <span className="w-4 h-4 border border-gray-400 rounded mr-2"></span>
                    Update voter registration
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 border border-gray-400 rounded mr-2"></span>
                    Find local grocery stores
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 border border-gray-400 rounded mr-2"></span>
                    Join local community groups
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 border border-gray-400 rounded mr-2"></span>
                    Explore nearby coworking spaces
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Helpful Resources</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded p-3 border">
                <h4 className="font-semibold text-purple-700 mb-1">MovingHelper</h4>
                <p className="text-xs text-gray-600">Professional moving services and quotes</p>
              </div>
              <div className="bg-white rounded p-3 border">
                <h4 className="font-semibold text-purple-700 mb-1">LocalConnect</h4>
                <p className="text-xs text-gray-600">Community groups and networking events</p>
              </div>
              <div className="bg-white rounded p-3 border">
                <h4 className="font-semibold text-purple-700 mb-1">WorkspaceSearch</h4>
                <p className="text-xs text-gray-600">Coworking spaces and remote-friendly cafes</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm border-t pt-6">
          <p>Generated by Find My City • {currentDate}</p>
          <p className="mt-1">This brief is based on comparative data and should be supplemented with personal research.</p>
        </footer>

        {/* Print Button - No Print */}
        <div className="print:hidden mt-8 text-center">
          <button 
            onClick={() => window.print()} 
            className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Print Brief
          </button>
        </div>
      </div>
    </div>
  );
}