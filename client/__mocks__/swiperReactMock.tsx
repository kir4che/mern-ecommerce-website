import type { ReactNode } from "react";

interface MockSwiperInstance {
  slideNext: () => void;
  slidePrev: () => void;
}

interface MockSwiperProps {
  children?: ReactNode;
  className?: string;
  onSwiper?: (instance: MockSwiperInstance) => void;
}

export const Swiper = ({ children, className, onSwiper }: MockSwiperProps) => {
  onSwiper?.({
    slideNext: () => undefined,
    slidePrev: () => undefined,
  });

  return (
    <div data-testid="swiper" className={className}>
      {children}
    </div>
  );
};

interface MockSwiperSlideProps {
  children?: ReactNode;
  className?: string;
}

export const SwiperSlide = ({ children, className }: MockSwiperSlideProps) => (
  <div data-testid="swiper-slide" className={className}>
    {children}
  </div>
);

export default { Swiper, SwiperSlide };
