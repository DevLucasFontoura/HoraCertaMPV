import { FaArrowLeft, FaClock, FaChartBar, FaEdit, FaTachometerAlt } from 'react-icons/fa';
import { CONSTANTES } from '../common/constantes';
import BottomNav from '../components/Menu/menu';
import { useRouter } from 'next/navigation';
import styles from './tutorial.module.css';
import { motion } from 'framer-motion';

const tutorialSteps = [
  { title: CONSTANTES.TUTORIAL_01, description: CONSTANTES.TUTORIAL_01_DESCRICAO, icon: <FaClock size={32} />, color: CONSTANTES.COR_01 },
  { title: CONSTANTES.TUTORIAL_02, description: CONSTANTES.TUTORIAL_02_DESCRICAO, icon: <FaChartBar size={32} />, color: CONSTANTES.COR_01 },
  { title: CONSTANTES.TUTORIAL_03, description: CONSTANTES.TUTORIAL_03_DESCRICAO, icon: <FaEdit size={32} />, color: CONSTANTES.COR_01 },
  { title: CONSTANTES.TUTORIAL_04, description: CONSTANTES.TUTORIAL_04_DESCRICAO, icon: <FaTachometerAlt size={32} />, color: CONSTANTES.COR_01 },
];

export default function TutorialScreen() {
  const navigate = useRouter();

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.backgroundIcon}>
        <FaClock size={200} color="rgba(0,0,0,0.03)" />
      </div>
      
      <motion.div 
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.header}>
          <button 
            className={styles.backButton}
            onClick={() => router.push(CONSTANTES.ROUTE_CONFIGURACAO)}
          >
            <FaArrowLeft size={20} />
          </button>
          <div>
            <h1 className={styles.title}>{CONSTANTES.TITULO_TUTORIAL}</h1>
            <p className={styles.subtitle}>{CONSTANTES.SUBTITULO_TUTORIAL}</p>
          </div>
        </div>

        <section className={styles.section}>
          {tutorialSteps.map((step, index) => (
            <motion.div 
              key={index} 
              className={styles.tutorialStep}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.iconContainer} style={{ color: step.color }}>
                {step.icon}
              </div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </motion.div>
          ))}
        </section>
      </motion.div>
      
      <BottomNav />
    </div>
  );
}