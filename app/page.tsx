import { CITIES } from '@/lib/data/cities';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Find My City</h1>
            <p className="text-xl text-gray-300 mb-2">
              Compare cities and see how your salary translates
            </p>
            <p className="text-gray-400">
              Perfect for remote workers looking to relocate
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
            <form action="/compare" method="GET" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="cityA" className="block text-sm font-medium text-gray-300 mb-2">
                    Current City
                  </label>
                  <input
                    type="text"
                    id="cityA"
                    name="a"
                    defaultValue="washington-dc"
                    required
                    list="cities"
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter city name..."
                  />
                </div>

                <div>
                  <label htmlFor="cityB" className="block text-sm font-medium text-gray-300 mb-2">
                    Potential City
                  </label>
                  <input
                    type="text"
                    id="cityB"
                    name="b"
                    defaultValue="omaha"
                    required
                    list="cities"
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter city name..."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="salary" className="block text-sm font-medium text-gray-300 mb-2">
                  Annual Salary
                </label>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  defaultValue="100000"
                  required
                  min="1"
                  step="1000"
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your annual salary..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Compare Cities
              </button>
            </form>

            <datalist id="cities">
              {CITIES.map(city => (
                <option key={city.slug} value={city.slug}>
                  {city.name}, {city.state}
                </option>
              ))}
            </datalist>
          </div>

          <div className="mt-8 text-center text-gray-400 text-sm">
            <p className="mb-2">Available cities:</p>
            <p className="text-xs leading-relaxed">
              {CITIES.map(city => `${city.name}, ${city.state}`).join(' • ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}