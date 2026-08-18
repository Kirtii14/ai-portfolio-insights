import { motion } from "motion/react";
import { pageTransition, pageVariants } from "../../motion/variants";

function PageTransition({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;
