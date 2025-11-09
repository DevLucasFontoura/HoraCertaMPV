"use client";

import { motion } from 'framer-motion';
import styles from './comoFunciona.module.css';

const ComoFunciona = () => {
  return (
    <section className={styles.howItWorks}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <h2 className={styles.sectionTitle}>Como Funciona</h2>
        <p className={styles.sectionSubtitle}>Em apenas 3 passos simples, você estará registrando ponto de forma eficiente</p>
      </motion.div>

      <div className={styles.stepsContainer}>
        <motion.div
          className={styles.step}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className={styles.stepNumber}>1</div>
          <h3>Cadastre-se</h3>
          <p>Crie sua conta gratuitamente em menos de 2 minutos</p>
        </motion.div>

        <motion.div
          className={styles.step}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className={styles.stepNumber}>2</div>
          <h3>Configure</h3>
          <p>Personalize seus horários de trabalho e preferências</p>
        </motion.div>

        <motion.div
          className={styles.step}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className={styles.stepNumber}>3</div>
          <h3>Use</h3>
          <p>Comece a registrar seu ponto e acompanhar suas horas trabalhadas</p>
        </motion.div>
      </div>
    </section>
  );
};

export default ComoFunciona;

