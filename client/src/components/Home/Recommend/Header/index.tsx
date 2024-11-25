import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const marqueeVariants = {
  animate: {
    x: [0, -800],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 24,
        ease: "linear",
      },
    },
  },
};

const RecommendHeader = () => {
  const navigate = useNavigate();

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    navigate(selectedValue);
  };

  return (
    <div className="items-center justify-between overflow-hidden sm:border-b border-primary sm:flex">
      <motion.div
        variants={marqueeVariants}
        className="flex items-center w-screen h-22 sm:flex sm:h-14 xl:h-18"
        animate="animate"
      >
        <div className="absolute flex gap-5">
          {[...Array(8)].map((_, i) => (
            <p className="space-x-3 min-w-fit" key={i}>
              <span className="text-3xl font-medium sm:font-normal sm:text-1.5xl">
                Recommend
              </span>
              <span className="text-xl sm:text-xs xl:text-sm">/本店推薦</span>
            </p>
          ))}
        </div>
      </motion.div>
      <div className="border-b border-primary sm:hidden" />
      <select
        className="z-0 block mt-2 ml-auto font-medium bg-white cursor-pointer sm:mt-0 w-fit min-w-44 sm:text-sm"
        onChange={handleSelectChange}
      >
        <option>從類別中尋找商品</option>
        <option value="/collections/all">全部</option>
        <option value="/collections/recommend">推薦</option>
        <option value="/collections/bread">麵包</option>
        <option value="/collections/cake">蛋糕</option>
        <option value="/collections/cookie">餅乾</option>
        <option value="/collections/other">其他</option>
      </select>
    </div>
  );
};

export default RecommendHeader;
