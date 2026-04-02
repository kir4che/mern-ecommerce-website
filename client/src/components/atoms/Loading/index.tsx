import { cn } from "@/utils/cn";

interface LoadingProps {
  fullPage?: boolean;
  className?: string;
}

const Loading = ({ fullPage = false, className }: LoadingProps) => {
  const content = (
    <p className="flex-center gap-3">
      <span
        data-testid="loading-animation"
        className="loading loading-spinner text-primary"
      />
      <span className="font-medium text-xl">載入中</span>
    </p>
  );

  if (fullPage)
    return (
      <div
        data-testid="loading-container"
        className={cn(
          "flex-1 flex-center flex-col w-full gap-4 p-20 min-h-[calc(100vh-35rem)]",
          className
        )}
      >
        {content}
      </div>
    );

  return (
    <div
      data-testid="loading-container"
      className={cn("flex-center gap-2", className)}
    >
      {content}
    </div>
  );
};

export default Loading;
