import { getCity, spendingPower, percentDelta, fmtMoney, fmtPct, normalizeSlug } from '@/lib/compare';
import { CITIES } from '@/lib/data/cities';
import Link from 'next/link';

export const dynamic = "force-dynamic";

interface DeltaPillProps {
  value: number;
  isPositive: boolean;
  className?: string;
}

function DeltaPill({ value, isPositive, className = "" }: DeltaPillProps) {
  const bgColor = isPositive ? "bg-green-600" : "bg-red-600";
  const textColor = "text-white";
  const icon = isPositive ? "▲" : "▼";
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} ${className}`}>
      <span className="mr-1">{icon}</span>
      {fmtPct(Math.abs(value))}
    </span>
  );
}

interface ComparePageProps {
  searchParams: {
    a?: string;
    b?: string;
    salary?: string;
  };
}

export default function ComparePage({ searchParams }: ComparePageProps) {
  const { a, b, salary: salaryStr } = searchParams;
  
  if (!a || !b || !salaryStr) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Missing Parameters</h1>
          <p className="text-gray-400 mb-6">Please provide both cities and a salary to compare.</p>
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
    const availableSlugs = CITIES.map(c => c.slug).join(', ');
    
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center max-w-2xl px-4">
          <h1 className="text-2xl font-bold mb-4">City Not Found</h1>
          <p className="text-gray-400 mb-4">
            {!cityA && `"${a}" not found. `}
            {!cityB && `"${b}" not found.`}
          </p>
          <p className="text-gray-400 mb-6">
            Available cities: {availableSlugs}
          </p>
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const spendingData = spendingPower(salary, cityA.rpp, cityB.rpp);
  
  // Calculate deltas for metrics (B compared to A)
  const deltas = {
    rpp: percentDelta(cityA.rpp, cityB.rpp),
    rentIndex: percentDelta(cityA.rentIndex, cityB.rentIndex),
    incomeMedian: percentDelta(cityA.incomeMedian, cityB.incomeMedian),
    diversityIndex: percentDelta(cityA.diversityIndex, cityB.diversityIndex),
    internetMbps: percentDelta(cityA.internetMbps, cityB.internetMbps),
    parksPer10k: percentDelta(cityA.parksPer10k, cityB.parksPer10k),
    cafesPer10k: percentDelta(cityA.cafesPer10k, cityB.cafesPer10k),
    barsPer10k: percentDelta(cityA.barsPer10k, cityB.barsPer10k),
  };

  // Determine if delta is positive (green) based on metric direction
  const isPositiveDelta = {
    rpp: deltas.rpp < 0, // Lower is better
    rentIndex: deltas.rentIndex < 0, // Lower is better
    incomeMedian: deltas.incomeMedian > 0, // Higher is better
    diversityIndex: deltas.diversityIndex > 0, // Higher is better
    internetMbps: deltas.internetMbps > 0, // Higher is better
    parksPer10k: deltas.parksPer10k > 0, // Higher is better
    cafesPer10k: deltas.cafesPer10k > 0, // Higher is better
    barsPer10k: deltas.barsPer10k > 0, // Higher is better
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Search
          </Link>
          <h1 className="text-3xl font-bold mb-2">
            {cityA.name}, {cityA.state} vs {cityB.name}, {cityB.state}
          </h1>
          <p className="text-xl text-gray-300">
            Your {fmtMoney(salary)} salary would be equivalent to{' '}
            <span className="font-semibold text-blue-400">{fmtMoney(spendingData.destEquivalent)}</span>{' '}
            in {cityB.name}
            {spendingData.deltaPct !== 0 && (
              <span className={`ml-2 ${spendingData.deltaPct > 0 ? 'text-green-400' : 'text-red-400'}`}>
                ({fmtPct(spendingData.deltaPct)} spending power)
              </span>
            )}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">Spending Power</h3>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{fmtMoney(spendingData.destEquivalent)}</p>
              <p className="text-sm text-gray-400">Equivalent salary needed</p>
              {spendingData.deltaPct !== 0 && (
                <DeltaPill 
                  value={spendingData.deltaPct} 
                  isPositive={spendingData.deltaPct > 0}
                />
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 text-green-400">Housing Snapshot</h3>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{cityB.rentIndex}</p>
              <p className="text-sm text-gray-400">Rent index (vs national avg)</p>
              {deltas.rentIndex !== 0 && (
                <DeltaPill 
                  value={deltas.rentIndex} 
                  isPositive={isPositiveDelta.rentIndex}
                />
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 text-purple-400">Lifestyle Vibe</h3>
            <div className="space-y-2">
              <p className="text-lg font-bold">{(cityB.diversityIndex * 100).toFixed(0)}% diverse</p>
              <p className="text-sm text-gray-400">{cityB.cafesPer10k} cafes per 10k people</p>
              {deltas.diversityIndex !== 0 && (
                <DeltaPill 
                  value={deltas.diversityIndex} 
                  isPositive={isPositiveDelta.diversityIndex}
                />
              )}
            </div>
          </div>
        </div>

        {/* Detailed Comparison Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold">Detailed Comparison</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Metric
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {cityA.name}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {cityB.name}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium">Regional Price Parity</td>
                  <td className="px-6 py-4 text-sm text-center">{cityA.rpp}</td>
                  <td className="px-6 py-4 text-sm text-center">{cityB.rpp}</td>
                  <td className="px-6 py-4 text-center">
                    {deltas.rpp !== 0 && (
                      <DeltaPill value={deltas.rpp} isPositive={isPositiveDelta.rpp} />
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium">Rent Index</td>
                  <td className="px-6 py-4 text-sm text-center">{cityA.rentIndex}</td>
                  <td className="px-6 py-4 text-sm text-center">{cityB.rentIndex}</td>
                  <td className="px-6 py-4 text-center">
                    {deltas.rentIndex !== 0 && (
                      <DeltaPill value={deltas.rentIndex} isPositive={isPositiveDelta.rentIndex} />
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium">Median Income</td>
                  <td className="px-6 py-4 text-sm text-center">{fmtMoney(cityA.incomeMedian)}</td>
                  <td className="px-6 py-4 text-sm text-center">{fmtMoney(cityB.incomeMedian)}</td>
                  <td className="px-6 py-4 text-center">
                    {deltas.incomeMedian !== 0 && (
                      <DeltaPill value={deltas.incomeMedian} isPositive={isPositiveDelta.incomeMedian} />
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium">Diversity Index</td>
                  <td className="px-6 py-4 text-sm text-center">{(cityA.diversityIndex * 100).toFixed(1)}%</td>
                  <td className="px-6 py-4 text-sm text-center">{(cityB.diversityIndex * 100).toFixed(1)}%</td>
                  <td className="px-6 py-4 text-center">
                    {deltas.diversityIndex !== 0 && (
                      <DeltaPill value={deltas.diversityIndex} isPositive={isPositiveDelta.diversityIndex} />
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium">Internet Speed</td>
                  <td className="px-6 py-4 text-sm text-center">{cityA.internetMbps} Mbps</td>
                  <td className="px-6 py-4 text-sm text-center">{cityB.internetMbps} Mbps</td>
                  <td className="px-6 py-4 text-center">
                    {deltas.internetMbps !== 0 && (
                      <DeltaPill value={deltas.internetMbps} isPositive={isPositiveDelta.internetMbps} />
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium">Parks per 10k</td>
                  <td className="px-6 py-4 text-sm text-center">{cityA.parksPer10k}</td>
                  <td className="px-6 py-4 text-sm text-center">{cityB.parksPer10k}</td>
                  <td className="px-6 py-4 text-center">
                    {deltas.parksPer10k !== 0 && (
                      <DeltaPill value={deltas.parksPer10k} isPositive={isPositiveDelta.parksPer10k} />
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium">Cafes per 10k</td>
                  <td className="px-6 py-4 text-sm text-center">{cityA.cafesPer10k}</td>
                  <td className="px-6 py-4 text-sm text-center">{cityB.cafesPer10k}</td>
                  <td className="px-6 py-4 text-center">
                    {deltas.cafesPer10k !== 0 && (
                      <DeltaPill value={deltas.cafesPer10k} isPositive={isPositiveDelta.cafesPer10k} />
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium">Bars per 10k</td>
                  <td className="px-6 py-4 text-sm text-center">{cityA.barsPer10k}</td>
                  <td className="px-6 py-4 text-sm text-center">{cityB.barsPer10k}</td>
                  <td className="px-6 py-4 text-center">
                    {deltas.barsPer10k !== 0 && (
                      <DeltaPill value={deltas.barsPer10k} isPositive={isPositiveDelta.barsPer10k} />
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium">Climate</td>
                  <td className="px-6 py-4 text-sm text-center">{cityA.climate}</td>
                  <td className="px-6 py-4 text-sm text-center">{cityB.climate}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-400 text-xs">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Optional Brief Link */}
        <div className="mt-8 text-center">
          <Link 
            href={`/brief?a=${slugA}&b=${slugB}&salary=${salary}`}
            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            Generate Relocation Brief
          </Link>
        </div>
      </div>
    </div>
  );
}