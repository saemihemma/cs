export default function LoadingIntel() {
  return (
    <div className="max-w-[1600px] mx-auto px-4">
      <div className="mb-8">
        <div className="glass rounded-2xl p-6 md:p-8 border border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="skeleton w-20 h-20 rounded-xl" />
            <div className="flex-1 space-y-3">
              <div className="skeleton h-9 w-80 rounded-lg" />
              <div className="flex flex-wrap gap-2">
                <div className="skeleton h-10 w-32 rounded-xl" />
                <div className="skeleton h-10 w-36 rounded-xl" />
                <div className="skeleton h-10 w-52 rounded-xl" />
              </div>
            </div>
            <div className="w-full lg:w-80 space-y-2">
              <div className="skeleton h-4 w-32 rounded" />
              <div className="skeleton h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div className="space-y-2">
            <div className="skeleton h-5 w-48 rounded" />
            <div className="skeleton h-3 w-72 rounded" />
          </div>
          <div className="skeleton h-3 w-40 rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="glass rounded-xl p-3 border border-white/10">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-2">
                  <div className="skeleton h-3 w-10 rounded" />
                  <div className="skeleton h-4 w-20 rounded" />
                </div>
                <div className="skeleton h-6 w-14 rounded-full" />
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div className="space-y-2">
                  <div className="skeleton h-7 w-16 rounded" />
                  <div className="skeleton h-3 w-16 rounded" />
                </div>
                <div className="space-y-2 text-right">
                  <div className="skeleton h-3 w-12 rounded ml-auto" />
                  <div className="skeleton h-3 w-20 rounded ml-auto" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div className="space-y-2">
            <div className="skeleton h-5 w-44 rounded" />
            <div className="skeleton h-3 w-80 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl p-5 border border-white/10">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="skeleton h-3 w-20 rounded" />
                  <div className="skeleton h-3 w-28 rounded" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="skeleton w-10 h-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-3 w-full rounded" />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="skeleton h-10 w-28 rounded-xl" />
                <div className="skeleton h-10 w-28 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-end justify-between gap-4 mb-4">
          <div className="space-y-2">
            <div className="skeleton h-5 w-52 rounded" />
            <div className="skeleton h-3 w-96 rounded" />
          </div>
          <div className="skeleton h-3 w-44 rounded" />
        </div>
        <div className="glass rounded-2xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <div className="p-6 space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="skeleton h-10 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

