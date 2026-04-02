const ProductDetailSkeleton = () => (
  <div className="p-8 max-md:p-5 space-y-12 md:space-y-16 animate-pulse">
    <div className="mx-auto flex max-w-screen-2xl max-lg:flex-col justify-between gap-x-12 gap-y-4 lg:gap-y-8">
      <div className="flex-1">
        <div className="w-full rounded bg-gray-200 aspect-square max-lg:max-h-100" />
      </div>
      <div className="flex-1 space-y-4">
        <div className="h-5 w-1/3 rounded bg-gray-200" />
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div className="h-10 w-2/3 rounded bg-gray-200" />
          <div className="flex gap-1.5">
            <div className="h-7 w-16 rounded-full bg-gray-200" />
            <div className="h-7 w-16 rounded-full bg-gray-200" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-11/12 rounded bg-gray-200" />
          <div className="h-4 w-4/5 rounded bg-gray-200" />
        </div>
        <div className="mt-8 mb-5 flex-between flex-wrap gap-4">
          <div className="h-10 w-36 rounded bg-gray-200" />
          <div className="h-10 w-36 rounded bg-gray-200" />
        </div>
        <div className="h-12 w-52 rounded-full bg-gray-200 ml-auto mb-8" />
        <div className="space-y-3 py-8 border-b border-slate-400">
          <div className="h-6 w-full rounded bg-gray-200" />
          <div className="h-6 w-full rounded bg-gray-200" />
          <div className="h-6 w-full rounded bg-gray-200" />
        </div>
      </div>
    </div>
    <div className="space-y-10">
      <div className="h-20 w-full rounded bg-gray-200" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="h-80 rounded bg-gray-200" />
        ))}
      </div>
    </div>
  </div>
);

export default ProductDetailSkeleton;
