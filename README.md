# CityScout MVP

A local-only web app to help remote workers compare U.S. cities and understand how their salary translates between locations.

## Requirements

- Node.js ≥ 18.18 (recommend Node 20 LTS)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server with Turbopack
npm run dev

# Open http://localhost:3000
```

## Features

- **Home Page**: Compare form with city selection and salary input
- **Compare Page**: Side-by-side city comparison with spending power analysis
- **Brief Page**: Printable relocation brief with detailed insights
- **Responsive Design**: Works on desktop and mobile
- **Local Data**: All city data stored in-memory, no external APIs

## Available Cities

The app includes data for these U.S. cities (use the slug in URLs):

- `washington-dc` - Washington, DC
- `omaha` - Omaha, NE
- `austin` - Austin, TX
- `denver` - Denver, CO
- `new-york-city` - New York City, NY
- `miami` - Miami, FL
- `seattle` - Seattle, WA
- `phoenix` - Phoenix, AZ
- `boston` - Boston, MA
- `nashville` - Nashville, TN
- `portland` - Portland, OR
- `atlanta` - Atlanta, GA
- `san-diego` - San Diego, CA
- `chicago` - Chicago, IL
- `tampa` - Tampa, FL

## Example URLs

```
# Home page
http://localhost:3000/

# Compare Washington DC vs Omaha with $100k salary
http://localhost:3000/compare?a=washington-dc&b=omaha&salary=100000

# Generate relocation brief
http://localhost:3000/brief?a=washington-dc&b=omaha&salary=100000
```

## Adding a New City

1. Edit `lib/data/cities.ts`
2. Add a new city object to the `CITIES` array
3. Include all required fields (slug, name, state, pop, etc.)
4. Restart the dev server

Example:
```typescript
{
  slug: "your-city",
  name: "Your City",
  state: "ST",
  pop: 500000,
  rpp: 95.0,
  rentIndex: 50,
  incomeMedian: 65000,
  diversityIndex: 0.75,
  internetMbps: 140,
  parksPer10k: 30,
  cafesPer10k: 20,
  barsPer10k: 12,
  climate: "Continental"
}
```

## Project Structure

```
findmycity_alt/
├── app/
│   ├── page.tsx              # Home page with compare form
│   ├── compare/
│   │   └── page.tsx          # Dynamic comparison page
│   ├── brief/
│   │   └── page.tsx          # Printable relocation brief
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── lib/
│   ├── compare.ts            # Helper functions
│   └── data/
│       └── cities.ts         # City data and types
├── package.json
├── tsconfig.json
└── README.md
```

## Tech Stack

- **Next.js 14/15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Local JSON data** (no database required)

## Data Sources

Current data uses plausible placeholder values. In a production version, this would be replaced with:

- **Regional Price Parity**: Bureau of Economic Analysis (BEA)
- **Housing Data**: Zillow, Redfin APIs
- **Demographics**: American Community Survey (ACS)
- **Internet Speed**: FCC Broadband Data
- **Amenities**: OpenStreetMap or Foursquare APIs

## Deployment Notes

This is a local-only MVP. For production deployment:

1. Add environment variables for external APIs
2. Implement proper error handling
3. Add database for dynamic city data
4. Consider adding authentication for premium features
5. Optimize for SEO and performance