'use client';

import { FaUser, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { CONSTANTES } from '../common/constantes';
import BottomNav from '../components/Menu/menu';
import { useRouter } from 'next/navigation';
import styles from './perfil.module.css';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface UserData {
  name: string;
  email: string;
  settings?: {
    notifications: {
      email: boolean;
      push: boolean;
    };
    workHours: {
      daily: number;
      weekly: number;
    };
  };
}

export default function ProfileScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData>({
    name: 'João Silva',
    email: 'joao@exemplo.com',
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      setError(null);
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
      setError('Erro ao salvar dados do usuário');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.containerWrapper}>
        <div className={styles.loadingState}>Carregando...</div>
        <BottomNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.containerWrapper}>
        <div className={styles.errorState}>{error}</div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.backgroundIcon}>
        <FaUser size={200} color="rgba(0,0,0,0.03)" />
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
            <h1 className={styles.title}>{CONSTANTES.TITULO_PERFIL}</h1>
            <p className={styles.subtitle}>{CONSTANTES.SUBTITULO_PERFIL}</p>
          </div>
        </div>

        <section className={styles.section}>
          <div className={styles.fieldContainer}>
            <div className={styles.labelContainer}>
              <FaUser className={styles.fieldIcon} />
              <label className={styles.label}>{CONSTANTES.TEXT_NOME_COMPLETO_PERFIL}</label>
            </div>
            <input
              className={`${styles.input} ${!isEditing ? styles.inputDisabled : ''}`}
              value={userData.name}
              onChange={(e) => setUserData({...userData, name: e.target.value})}
              disabled={!isEditing}
            />
          </div>

          <div className={styles.fieldContainer}>
            <div className={styles.labelContainer}>
              <FaEnvelope className={styles.fieldIcon} />
              <label className={styles.label}>{CONSTANTES.TEXT_EMAIL_PERFIL}</label>
            </div>
            <input
              className={`${styles.input} ${!isEditing ? styles.inputDisabled : ''}`}
              value={userData.email}
              onChange={(e) => setUserData({...userData, email: e.target.value})}
              disabled={!isEditing}
              type="email"
            />
          </div>
        </section>

        <button 
          className={`${styles.actionButton} ${isEditing ? styles.saveButton : ''}`}
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          disabled={loading}
        >
          {isEditing ? CONSTANTES.BOTAO_SALVAR_PERFIL : CONSTANTES.BOTAO_EDITAR_PERFIL}
        </button>
      </motion.div>
      
      <BottomNav />
    </div>
  );
}