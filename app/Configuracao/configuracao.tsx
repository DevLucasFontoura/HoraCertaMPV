import { FaUser, FaBell, FaClock, FaCalendar, FaBook, FaQuestionCircle, FaHeadset, FaLock, FaInfoCircle, FaCog } from 'react-icons/fa';
// import React, { useEffect } from 'react';
import BottomNav from '../components/Menu/menu';
import { useNavigate } from 'react-router-dom';
import styles from './configuracao.module.css';
import { motion } from 'framer-motion';
import { CONSTANTES } from '../common/constantes';

// Mock user settings type
// interface UserSettings {
//   notifications: boolean;
//   emailReports: boolean;
//   workSchedule: {
//     workTime: number;
//     lunchTime: number;
//   };
// }

export default function SettingsScreen() {
  const navigate = useNavigate();
//   const [userSettings, setUserSettings] = useState<UserSettings>({
//     notifications: false,
//     emailReports: false,
//     workSchedule: {
//       workTime: 8,
//       lunchTime: 1
//     }
//   });

  // Mock user data loading
//   useEffect(() => {
//     // Simulate loading user settings from an API
//     const mockUserSettings = {
//       notifications: true,
//       emailReports: true,
//       workSchedule: {
//         workTime: 8,
//         lunchTime: 1
//       }
//     };
//     // setUserSettings(mockUserSettings);
//   }, []);

  const settingsOptions = {
    profile: [
      {
        title: CONSTANTES.TITULO_CONFIGURACAO_PERFIL,
        icon: <FaUser />,
        description: CONSTANTES.SUBTITULO_CONFIGURACAO_PERFIL,
        onPress: () => navigate(CONSTANTES.CAMINHO_CONFIGURACAO_PERFIL)
      }
    ],
    preferences: [
      {
        title: CONSTANTES.TITULO_CONFIGURACAO_NOTIFICACOES,
        icon: <FaBell />,
        description: CONSTANTES.SUBTITULO_CONFIGURACAO_NOTIFICACOES,
        onPress: () => navigate(CONSTANTES.CAMINHO_CONFIGURACAO_NOTIFICACOES)
      },
      {
        title: CONSTANTES.TITULO_CONFIGURACAO_JORNADA,
        icon: <FaClock />,
        description: CONSTANTES.SUBTITULO_CONFIGURACAO_JORNADA,
        onPress: () => navigate(CONSTANTES.CAMINHO_CONFIGURACAO_JORNADA)
      },
      {
        title: CONSTANTES.TITULO_CONFIGURACAO_FERIADOS,
        icon: <FaCalendar />,
        description: CONSTANTES.SUBTITULO_CONFIGURACAO_FERIADOS,
        onPress: () => navigate(CONSTANTES.CAMINHO_CONFIGURACAO_FERIADOS)
      }
    ],
    help: [
      {
        title: CONSTANTES.TITULO_CONFIGURACAO_TUTORIAL,
        icon: <FaBook />,
        description: CONSTANTES.SUBTITULO_CONFIGURACAO_TUTORIAL,
        onPress: () => navigate(CONSTANTES.CAMINHO_CONFIGURACAO_TUTORIAL)
      },
      {
        title: CONSTANTES.TITULO_CONFIGURACAO_PERGUNTAS,
        icon: <FaQuestionCircle />,
        description: CONSTANTES.SUBTITULO_CONFIGURACAO_PERGUNTAS,
        onPress: () => navigate(CONSTANTES.CAMINHO_CONFIGURACAO_PERGUNTAS)
      },
      {
        title: CONSTANTES.TITULO_CONFIGURACAO_SUPORTE,
        icon: <FaHeadset />,
        description: CONSTANTES.SUBTITULO_CONFIGURACAO_SUPORTE,
        onPress: () => navigate(CONSTANTES.CAMINHO_CONFIGURACAO_SUPORTE)
      }
    ],
    about: [
      {
        title: CONSTANTES.TITULO_CONFIGURACAO_POLITICA,
        icon: <FaLock />,
        description: CONSTANTES.SUBTITULO_CONFIGURACAO_POLITICA,
        onPress: () => navigate(CONSTANTES.CAMINHO_CONFIGURACAO_POLITICA)
      },
      {
        title: CONSTANTES.TITULO_CONFIGURACAO_SOBRE,
        icon: <FaInfoCircle />,
        description: CONSTANTES.SUBTITULO_CONFIGURACAO_SOBRE,
        onPress: () => navigate(CONSTANTES.CAMINHO_CONFIGURACAO_SOBRE)
      }
    ]
  };

  const handleLogout = () => {
    // Mock logout functionality
    navigate(CONSTANTES.CAMINHO_CONFIGURACAO_SAIR);
  };

  const handleDeleteAccount = () => {
    // Mock delete account functionality
    console.log('Delete account clicked');
  };

  const renderSection = (title: string, icon: React.ReactNode, options: any[]) => (
    <motion.section 
      className={styles.section}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
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
    </motion.section>
  );

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.backgroundIcon}>
        <FaClock size={200} color="rgba(0,0,0,0.03)" />
      </div>
      
      <div className={styles.container}>
        <motion.header 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={styles.title}>{CONSTANTES.TITULO_CONFIGURACAO}</h1>
          <p className={styles.subtitle}>{CONSTANTES.SUBTITULO_CONFIGURACAO}</p>
        </motion.header>

        <div className={styles.content}>
          {renderSection('Perfil', <FaUser size={24} />, settingsOptions.profile)}
          {renderSection('Preferências', <FaCog size={24} />, settingsOptions.preferences)}
          {renderSection('Ajuda', <FaQuestionCircle size={24} />, settingsOptions.help)}
          {renderSection('Sobre', <FaInfoCircle size={24} />, settingsOptions.about)}

          <motion.section 
            className={styles.section}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.dangerZone}>
              <h3 className={styles.dangerTitle}>{CONSTANTES.CONFIGURACAO_ZONA_DE_PERIGO}</h3>
              <p className={styles.dangerDescription}>
                {CONSTANTES.CONFIGURACAO_ZONA_DE_PERIGO_DESCRICAO}
              </p>
              <button 
                className={styles.dangerButton} 
                onClick={handleDeleteAccount}
              >
                {CONSTANTES.CONFIGURACAO_ZONA_DE_PERIGO_BOTAO}
              </button>
            </div>
          </motion.section>

          <button 
            className={`${styles.outlineButton} ${styles.logoutButton}`}
            onClick={handleLogout}
          >
            {CONSTANTES.SUBTITULO_CONFIGURACAO_SAIR}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}