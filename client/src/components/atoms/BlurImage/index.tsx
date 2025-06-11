import { useState } from "react";

interface BlurImageProps {
  src: string;
  alt: string;
  className?: string;
  onError?: () => void;
}

// 當圖片載入時，先顯示模糊背景，載入完成後再顯示圖片。
const BlurImage = ({ src, alt, className, onError }: BlurImageProps) => {
  const [isLoading, setLoading] = useState(true);

  const handleError = () => {
    if (onError) onError();
    setLoading(false);
  };

  return (
    <div className="relative overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-center bg-cover blur-md" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoading(false)}
        onError={handleError}
        data-testid="blur-image"
        className={`
          duration-700 ease-in-out
          ${isLoading ? "scale-110 blur-md" : "scale-100 blur-0"}
          ${className}
        `}
      />
    </div>
  );
};

export default BlurImage;
