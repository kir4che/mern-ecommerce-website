import { motion } from "framer-motion";

interface MarqueeProps {
  className?: string;
  children: React.ReactNode;
}

const marqueeVariants = {
  animate: {
    x: [0, -800],
    transition: {
      repeat: Infinity,
      duration: 24,
      ease: "linear",
    },
  },
};

const Marquee: React.FC<MarqueeProps> = ({ className, children }) => (
  <motion.div
    variants={marqueeVariants}
    animate="animate"
    className={className}
  >
    {children}
  </motion.div>
);

export default Marquee;
