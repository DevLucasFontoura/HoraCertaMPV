import { motion } from 'framer-motion';
import styled from 'styled-components';

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <PageWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </PageWrapper>
  );
};

const PageWrapper = styled(motion.div)`
  width: 100%;
`;

export default PageTransition;