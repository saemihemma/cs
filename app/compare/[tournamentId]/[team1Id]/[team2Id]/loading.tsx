export default function LoadingCompare() {
  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="mb-8">
        <div className="glass rounded-2xl p-6 md:p-8 border border-white/10">
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="text-center space-y-3">
              <div className="skeleton w-20 h-20 mx-auto rounded-xl" />
              <div className="skeleton h-4 w-40 mx-auto rounded" />
              <div className="skeleton h-3 w-24 mx-auto rounded" />
            </div>
            <div className="text-center space-y-3">
              <div className="skeleton h-10 w-16 mx-auto rounded" />
              <div className="skeleton h-4 w-28 mx-auto rounded" />
              <div className="skeleton h-3 w-24 mx-auto rounded" />
            </div>
            <div className="text-center space-y-3">
              <div className="skeleton w-20 h-20 mx-auto rounded-xl" />
              <div className="skeleton h-4 w-40 mx-auto rounded" />
              <div className="skeleton h-3 w-24 mx-auto rounded" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="skeleton h-10 w-32 rounded-lg" />
        <div className="skeleton h-10 w-32 rounded-lg" />
      </div>

      <div className="mb-8">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div className="space-y-2">
            <div className="skeleton h-5 w-44 rounded" />
            <div className="skeleton h-3 w-72 rounded" />
          </div>
        </div>
        <div className="glass rounded-2xl p-4 border border-white/10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-start justify-between">
                  <div className="skeleton h-4 w-20 rounded" />
                  <div className="skeleton h-6 w-14 rounded-full" />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="skeleton h-3 w-10 rounded" />
                  <div className="skeleton h-3 w-8 rounded" />
                  <div className="skeleton h-3 w-10 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="glass rounded-xl p-5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-6 w-14 rounded-full" />
            </div>
            <div className="skeleton h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

