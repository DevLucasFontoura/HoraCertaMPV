"use client";

import { useEffect, useState } from 'react';
import BottomNav from '../../../components/Menu/menu';
import styles from './bemvindo.module.css';
import { motion } from 'framer-motion';

interface UserData {
  name: string;
  email: string;
  settings: {
    notifications: {
      email: boolean;
      push: boolean;
    };
    workHours: {
      daily: number;
      weekly: number;
    };
  };
  createdAt: string;
}

const BemVindo = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    const mockUserData: UserData = {
      name: 'João Silva',
      email: 'joao@exemplo.com',
      settings: {
        notifications: {
          email: true,
          push: true,
        },
        workHours: {
          daily: 8,
          weekly: 40,
        },
      },
      createdAt: new Date().toISOString(),
    };

    // Simular delay de carregamento
    setTimeout(() => {
      setUserData(mockUserData);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = () => {
    return new Date().toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const formatWorkHours = (hours: number) => {
    return `${hours.toString().padStart(2, '0')}:00`;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <motion.div 
          className={styles.welcomeContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.welcomeHeader}>
            <span className={styles.welcomeText}>Bem vindo,</span>
            <span className={styles.nameText}>
              {loading ? 'Carregando...' : (userData?.name || 'Visitante')}
            </span>
          </div>
          <motion.p 
            className={styles.dateText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.2 }}
          >
            {formatDate()}
          </motion.p>
        </motion.div>
      </header>

      <div className={styles.content}>
        <div className={styles.statsContainer}>
          <motion.div 
            className={`${styles.statsCard} ${styles.workCard}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className={styles.statsHeader}>
              <div className={styles.dot} />
              <span className={styles.statsLabel}>Horas Trabalhadas</span>
            </div>
            <div className={styles.statsValue}>
              {loading ? '--:--' : formatWorkHours(userData?.settings?.workHours?.daily || 0)}
            </div>
            <div className={styles.statsSubtext}>Hoje</div>
          </motion.div>

          <motion.div 
            className={`${styles.statsCard} ${styles.balanceCard}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className={styles.statsHeader}>
              <div className={styles.dot} />
              <span className={styles.statsLabel}>Banco de Horas</span>
            </div>
            <div className={styles.statsValue}>
              {'00:00'}
            </div>
            <div className={styles.statsSubtext}>Total</div>
          </motion.div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default BemVindo;