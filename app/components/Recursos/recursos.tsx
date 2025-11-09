"use client";

import { AiOutlineClockCircle, AiOutlineEdit, AiOutlineFileText, AiOutlineMobile, AiOutlineSafety, AiOutlineTeam } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { CONSTANTES } from '../../common/constantes';
import styles from './recursos.module.css';

const Recursos = () => {
  const features = [
    {
      icon: <AiOutlineClockCircle size={24} />,
      title: CONSTANTES.CARD_RECURSOS_01_TITULO,
      description: CONSTANTES.CARD_RECURSOS_01_SUBTITULO
    },
    {
      icon: <AiOutlineEdit size={24} />,
      title: CONSTANTES.CARD_RECURSOS_02_TITULO,
      description: CONSTANTES.CARD_RECURSOS_02_SUBTITULO
    },
    {
      icon: <AiOutlineFileText size={24} />,
      title: CONSTANTES.CARD_RECURSOS_03_TITULO,
      description: CONSTANTES.CARD_RECURSOS_03_SUBTITULO
    },
    {
      icon: <AiOutlineMobile size={24} />,
      title: CONSTANTES.CARD_RECURSOS_04_TITULO,
      description: CONSTANTES.CARD_RECURSOS_04_SUBTITULO
    },
    {
      icon: <AiOutlineSafety size={24} />,
      title: CONSTANTES.CARD_RECURSOS_05_TITULO,
      description: CONSTANTES.CARD_RECURSOS_05_SUBTITULO
    },
    {
      icon: <AiOutlineTeam size={24} />,
      title: CONSTANTES.CARD_RECURSOS_06_TITULO,
      description: CONSTANTES.CARD_RECURSOS_06_SUBTITULO
    }
  ];

  return (
    <section className={styles.features} id="recursos">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <h2 className={styles.sectionTitle}>{CONSTANTES.TITULO_RECURSOS}</h2>
        <p className={styles.sectionSubtitle}>{CONSTANTES.SUBTITULO_RECURSOS}</p>
      </motion.div>
      
      <div className={styles.featureGrid}>
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className={styles.featureCard}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -4 }}
          >
            <div className={styles.featureIcon}>
              {feature.icon}
            </div>
            <div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Recursos;

