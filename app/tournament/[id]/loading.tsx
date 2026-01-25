export default function LoadingTournament() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-8">
        <div className="glass rounded-2xl p-6 md:p-8 border border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="skeleton h-8 w-72 rounded-lg" />
              <div className="skeleton h-4 w-44 rounded-lg" />
            </div>
            <div className="w-full lg:max-w-sm space-y-2">
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="glass rounded-xl p-5 border border-white/10">
            <div className="flex items-start gap-4">
              <div className="skeleton w-12 h-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
                <div className="skeleton h-3 w-20 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

