interface CartSkeletonProps {
  itemCount?: number;
}

const CartSkeleton = ({ itemCount = 3 }: CartSkeletonProps) => {
  const items = Array.from({ length: Math.min(itemCount, 4) });

  return (
    <div className="relative mx-auto flex w-full max-w-7xl max-md:flex-col gap-8 px-5 py-8 lg:gap-12 xl:px-0">
      <section className="min-w-0 flex-1 space-y-6">
        <div className="flex items-end justify-between">
          <h2>購物車 (0)</h2>
          <div className="h-10 w-20 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <ul className="divide-y divide-gray-200 px-4 sm:px-6">
            {items.map((_, idx) => (
              <li key={idx} className="flex gap-4 py-6 sm:gap-6">
                <div className="aspect-square w-24 shrink-0 animate-pulse rounded bg-gray-200 sm:w-32" />
                <div className="flex flex-1 flex-col gap-3">
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                  </div>
                  <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
                  <div className="mt-auto flex items-end justify-between gap-4">
                    <div className="h-9 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="space-y-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-2 w-full animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </section>
      <aside className="w-full shrink-0 md:w-80 lg:w-96">
        <div className="sticky top-24 space-y-4 rounded-xl border border-gray-200 p-6 shadow-md">
          <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200" />
          <div className="space-y-4 border-y border-gray-200 py-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
          <div className="flex-between py-2">
            <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
            <div className="h-8 w-1/3 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-12 w-full animate-pulse rounded-full bg-gray-200" />
        </div>
      </aside>
    </div>
  );
};

export default CartSkeleton;
