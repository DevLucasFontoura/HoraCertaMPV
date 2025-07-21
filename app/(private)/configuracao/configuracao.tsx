"use client";

import { FaUser, FaBell, FaClock, FaCalendar, FaBook, FaQuestionCircle, FaHeadset, FaLock, FaInfoCircle, FaCog, FaCreditCard } from 'react-icons/fa';
import React, { useState, useCallback, useMemo } from 'react';
import BottomNav from '../../components/Menu/menu';
import { useRouter } from 'next/navigation';
import styles from './configuracao.module.css';
import { CONSTANTES } from '../../common/constantes';
import { AuthService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import DeleteAccountModal from '../../components/PopUpConfirmacao/DeleteAccountModal';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useEffect, useRef } from 'react';

interface SettingOption {
  title: string;
  icon: React.ReactNode;
  description: string;
  onPress: () => void;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDangerZoneDropdown, setShowDangerZoneDropdown] = useState(false);
  const dangerZoneRef = useRef<HTMLDivElement>(null);

  // Detectar cliques fora do dropdown para fechá-lo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dangerZoneRef.current && !dangerZoneRef.current.contains(event.target as Node)) {
        setShowDangerZoneDropdown(false);
      }
    };

    if (showDangerZoneDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDangerZoneDropdown]);

  // Memoizar as opções de configuração para evitar recriações desnecessárias
  const settingsOptions = useMemo(() => ({
    profile: [
      {
        title: CONSTANTES.TITULO_CONFIGURACAO_PERFIL,
        icon: <FaUser />,
        description: CONSTANTES.SUBTITULO_CONFIGURACAO_PERFIL,
        onPress: () => router.push(CONSTANTES.CAMINHO_CONFIGURACAO_PERFIL)
      }
    ],
    preferences: [
      {
        title: CONSTANTES.TITULO_CONFIGURACAO_NOTIFICACOES,
        icon: <FaBell />,
        description: CONSTANTES.SUBTITULO_CONFIGURACAO_NOTIFICACOES,
        onPress: () => router.push(CONSTANTES.CAMINHO_CONFIGURACAO_NOTIFICACOES)
      },
      {
        title: CONSTANTES.TITULO_CONFIGURACAO_JORNADA,
        icon: <FaClock />,
        description: CONSTANTES.SUBTITULO_CONFIGURACAO_JORNADA,
        onPress: () => router.push(CONSTANTES.CAMINHO_CONFIGURACAO_JORNADA)
      },
      {
        title: CONSTANTES.TITULO_CONFIGURACAO_FERIADOS,
        icon: <FaCalendar />,
        description: CONSTANTES.SUBTITULO_CONFIGURACAO_FERIADOS,
        onPress: () => router.push(CONSTANTES.CAMINHO_CONFIGURACAO_FERIADOS)
      },
      {
        title: CONSTANTES.TITULO_CONFIGURACAO_PLANO,
        icon: <FaCreditCard />,
        description: CONSTANTES.SUBTITULO_CONFIGURACAO_PLANO,
        onPress: () => router.push(CONSTANTES.CAMINHO_CONFIGURACAO_PLANO)
      }
    ],
    help: [
      {
        title: CONSTANTES.TITULO_CONFIGURACAO_TUTORIAL,
        icon: <FaBook />,
        description: CONSTANTES.SUBTITULO_CONFIGURACAO_TUTORIAL,
        onPress: () => router.push(CONSTANTES.CAMINHO_CONFIGURACAO_TUTORIAL)
      },
      {
        title: CONSTANTES.TITULO_CONFIGURACAO_PERGUNTAS,
        icon: <FaQuestionCircle />,
        description: CONSTANTES.SUBTITULO_CONFIGURACAO_PERGUNTAS,
        onPress: () => router.push(CONSTANTES.CAMINHO_CONFIGURACAO_PERGUNTAS)
      },
      {
        title: CONSTANTES.TITULO_CONFIGURACAO_SUPORTE,
        icon: <FaHeadset />,
        description: CONSTANTES.SUBTITULO_CONFIGURACAO_SUPORTE,
        onPress: () => router.push(CONSTANTES.CAMINHO_CONFIGURACAO_SUPORTE)
      }
    ],
    about: [
      {
        title: CONSTANTES.TITULO_CONFIGURACAO_POLITICA,
        icon: <FaLock />,
        description: CONSTANTES.SUBTITULO_CONFIGURACAO_POLITICA,
        onPress: () => router.push(CONSTANTES.CAMINHO_CONFIGURACAO_POLITICA)
      },
      {
        title: CONSTANTES.TITULO_CONFIGURACAO_SOBRE,
        icon: <FaInfoCircle />,
        description: CONSTANTES.SUBTITULO_CONFIGURACAO_SOBRE,
        onPress: () => router.push(CONSTANTES.CAMINHO_CONFIGURACAO_SOBRE)
      }
    ]
  }), [router]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.push(CONSTANTES.CAMINHO_CONFIGURACAO_SAIR);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }, [logout, router]);

  const handleDeleteAccount = useCallback(() => {
    setShowDeleteModal(true);
    setShowDangerZoneDropdown(false);
  }, []);

  const handleOpenDangerZone = useCallback(() => {
    setShowDangerZoneDropdown(!showDangerZoneDropdown);
  }, [showDangerZoneDropdown]);

  const handleConfirmDelete = useCallback(async (password: string) => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      if (!user || !user.email) {
        setDeleteError('Usuário não autenticado. Faça login novamente.');
        setIsDeleting(false);
        return;
      }
      // Reautenticar usuário
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      // Excluir conta
      await AuthService.deleteUserAccount();
      // Fazer logout explicitamente
      await logout();
      localStorage.clear();
      router.push('/');
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      if (firebaseError.code === 'auth/wrong-password') {
        setDeleteError('Senha incorreta. Tente novamente.');
      } else if (firebaseError.code === 'auth/too-many-requests') {
        setDeleteError('Muitas tentativas. Tente novamente mais tarde.');
      } else if (firebaseError.code === 'auth/network-request-failed') {
        setDeleteError('Erro de rede. Verifique sua conexão.');
      } else {
        setDeleteError('Erro ao deletar conta. Faça login novamente e tente de novo.');
      }
      setIsDeleting(false);
    }
  }, [user, logout, router]);

  const handleCloseDeleteModal = useCallback(() => {
    if (!isDeleting) {
      setShowDeleteModal(false);
      setDeleteError(null);
    }
  }, [isDeleting]);



  const renderSection = useCallback((title: string, icon: React.ReactNode, options: SettingOption[]) => (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>{icon}</div>
        <h2 className={styles.sectionTitle}>{title}</h2>
      </div>
      {options.map((option, index) => (
        <button 
          key={index} 
          className={styles.settingItem} 
          onClick={option.onPress}
        >
          <div className={styles.settingInfo}>
            <span className={styles.settingIcon}>{option.icon}</span>
            <div className={styles.settingTextContainer}>
              <h3 className={styles.settingLabel}>{option.title}</h3>
              <p className={styles.settingDescription}>{option.description}</p>
            </div>
          </div>
        </button>
      ))}
    </section>
  ), []);

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.backgroundIcon}>
        <FaClock size={200} color="rgba(0,0,0,0.03)" />
      </div>
      
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>{CONSTANTES.TITULO_CONFIGURACAO}</h1>
            <p className={styles.subtitle}>{CONSTANTES.SUBTITULO_CONFIGURACAO}</p>
          </div>
        </header>

        <div className={styles.content}>
          {renderSection('Perfil', <FaUser size={24} />, settingsOptions.profile)}
          {renderSection('Preferências', <FaCog size={24} />, settingsOptions.preferences)}
          {renderSection('Ajuda', <FaQuestionCircle size={24} />, settingsOptions.help)}
          {renderSection('Sobre', <FaInfoCircle size={24} />, settingsOptions.about)}

          <div className={styles.dangerZoneContainer} ref={dangerZoneRef}>
            <button 
              className={styles.dangerZoneButton}
              onClick={handleOpenDangerZone}
            >
              <FaExclamationTriangle size={16} />
              <span>Zona de Perigo</span>
            </button>
            
            {showDangerZoneDropdown && (
              <div className={styles.dangerZoneDropdown}>
                <div className={styles.dangerZoneContent}>
                  <h3 className={styles.dangerTitle}>{CONSTANTES.CONFIGURACAO_ZONA_DE_PERIGO}</h3>
                  <p className={styles.dangerDescription}>
                    {CONSTANTES.CONFIGURACAO_ZONA_DE_PERIGO_DESCRICAO}
                  </p>
                  {deleteError && (
                    <p className={styles.errorMessage}>
                      {deleteError}
                    </p>
                  )}
                  <button 
                    className={styles.dangerButton} 
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deletando...' : CONSTANTES.CONFIGURACAO_ZONA_DE_PERIGO_BOTAO}
                  </button>
                </div>
              </div>
            )}
          </div>

          <button 
            className={`${styles.outlineButton} ${styles.logoutButton}`}
            onClick={handleLogout}
          >
            {CONSTANTES.SUBTITULO_CONFIGURACAO_SAIR}
          </button>
        </div>
      </div>

      <BottomNav />

      <DeleteAccountModal
        open={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        error={deleteError}
      />


    </div>
  );
}