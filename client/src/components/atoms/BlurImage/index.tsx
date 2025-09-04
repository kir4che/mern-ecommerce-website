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
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div
          data-testid="blur-background"
          className="absolute inset-0 bg-center bg-cover blur-md scale-110"
          style={{ backgroundImage: `url(${src})` }}
        />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoading(false)}
        onError={handleError}
        data-testid="blur-image"
        className={`relative w-full h-full object-cover object-center duration-700 ease-in-out ${isLoading ? "opacity-0" : "opacity-100"}`}
      />
    </div>
  );
};

export default BlurImage;
