interface ProductCardSkeletonProps {
  count?: number;
}

const ProductCardSkeleton = ({ count = 10 }: ProductCardSkeletonProps) => {
  const items = Array.from({ length: Math.max(1, count) });

  return (
    <div className="grid w-full grid-cols-1 gap-6 py-6 xs:grid-cols-2 md:grid-cols-3 md:gap-10 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8 2xl:gap-12">
      {items.map((_, idx) => (
        <div key={idx} className="card size-full animate-pulse">
          <figure className="relative w-full aspect-square p-2">
            <div className="size-full rounded-full bg-gray-200" />
          </figure>
          <div className="card-body p-2 space-y-2">
            <div className="h-5 w-3/4 rounded bg-gray-200" />
            <div className="flex gap-1.5">
              <div className="h-5 w-14 rounded-full bg-gray-200" />
              <div className="h-5 w-12 rounded-full bg-gray-200" />
            </div>
            <div className="h-8 w-2/5 rounded bg-gray-200 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCardSkeleton;
