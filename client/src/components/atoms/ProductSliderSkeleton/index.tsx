interface ProductSliderSkeletonProps {
  count?: number;
}

const ProductSliderSkeleton = ({ count = 4 }: ProductSliderSkeletonProps) => {
  const items = Array.from({ length: Math.max(3, count) });

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex min-h-72 gap-8">
        {items.map((_, idx) => (
          <div
            key={idx}
            className="card w-full shrink-0 animate-pulse sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.35rem)] xl:w-[calc(27.5%-1.5rem)] 2xl:w-[calc(22%-1.6rem)]"
          >
            <figure className="relative">
              <div className="aspect-square w-full rounded-full bg-gray-200" />
              <div className="absolute top-4 left-0 h-10 w-36 rounded-r bg-gray-300" />
            </figure>
            <div className="card-body">
              <div className="flex flex-wrap -mt-6 gap-1.5">
                <div className="h-7 w-14 rounded-full bg-gray-200" />
                <div className="h-7 w-14 rounded-full bg-gray-200" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-11/12 rounded bg-gray-200" />
                <div className="h-4 w-10/12 rounded bg-gray-200" />
              </div>
              <div className="flex-between border-t border-gray-200 py-2.5">
                <div className="h-4 w-16 rounded bg-gray-200" />
                <div className="h-4 w-24 rounded bg-gray-200" />
              </div>
              <div className="card-actions flex-between items-center">
                <div className="h-8 w-24 rounded bg-gray-200" />
                <div className="size-8 rounded-full bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSliderSkeleton;
