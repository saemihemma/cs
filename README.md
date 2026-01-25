# CS2 Intel

Scout your CS2 opponents by aggregating FACEIT statistics for tournament teams.

## Features

- **Tournament Browser** - Enter any Challengermode tournament ID to see registered teams
- **Player Stats** - View FACEIT level, ELO, and per-map win rates for all players
- **Map Analysis** - Team-weighted win rates across the CS2 competitive map pool
- **Team Comparison** - Side-by-side comparison of two teams' map strengths

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **APIs**: FACEIT Data API, Challengermode GraphQL API

## Getting Started

### Prerequisites

- Node.js 18+
- FACEIT API Key ([Get one here](https://developers.faceit.com/))
- Challengermode API Refresh Key

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/cs2-intel.git
   cd cs2-intel
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your API keys:
   ```env
   CHALLENGERMODE_REFRESH_KEY=your_key_here
   FACEIT_API_KEY=your_key_here
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
cs2-intel/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home - tournament ID input
│   ├── tournament/        # Tournament team listing
│   ├── intel/             # Team intel/stats view
│   └── compare/           # Team comparison view
├── components/            # Reusable UI components
│   ├── data/              # Data display (FaceitLevel, WinRate, etc.)
│   └── ui/                # Generic UI (GlassCard, etc.)
├── lib/                   # Core logic
│   ├── challengermode/    # Challengermode API client
│   ├── faceit/            # FACEIT API client
│   ├── intel/             # Intel report generation
│   ├── cache/             # File-based caching
│   └── design/            # Animation variants
└── data/cache/            # Cached API responses (gitignored)
```

## API Keys

### FACEIT API
1. Go to [FACEIT Developers](https://developers.faceit.com/)
2. Create an application
3. Copy your API key

### Challengermode API
1. Log in to Challengermode
2. Go to your organization settings
3. Generate an API refresh key

## Contributing

Contributions welcome! Please open an issue first to discuss changes.

## License

MIT
