import { CONSTANTES } from '../../../../common/constantes';
import BottomNav from '../../../../components/Menu/menu';
import { FaBell, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './notificacoes.module.css';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function NotificationsScreen() {
  const navigate = useNavigate();
  const [pointReminder, setPointReminder] = useState(false);
  const [emailNotifications] = useState(false);

  const handlePointReminderToggle = (value: boolean) => {
    setPointReminder(value);
  };

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.backgroundIcon}>
        <FaBell size={200} color="rgba(0,0,0,0.10)" />
      </div>
      
      <motion.div 
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.header}>
          <button 
            className={styles.backButton}
            onClick={() => navigate(CONSTANTES.ROUTE_CONFIGURACAO)}
          >
            <FaArrowLeft size={20} />
          </button>
          <div>
            <h1 className={styles.title}>Notificações</h1>
            <p className={styles.subtitle}>Configure suas preferências de notificação</p>
          </div>
        </div>

        <section className={styles.section}>
          <div className={styles.notificationItem}>
            <div className={styles.notificationText}>
              <h3 className={styles.notificationTitle}>{CONSTANTES.NOTIFICACAO_LEMBRETE_PONTO}</h3>
              <p className={styles.notificationDescription}>
                {CONSTANTES.NOTIFICACAO_LEMBRETE_PONTO_DESCRICAO}
              </p>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={pointReminder}
                onChange={(e) => handlePointReminderToggle(e.target.checked)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.notificationItem}>
            <div className={styles.notificationText}>
              <h3 className={styles.notificationTitle}>{CONSTANTES.NOTIFICACAO_EMAILS}</h3>
              <p className={styles.notificationDescription}>
                {CONSTANTES.NOTIFICACAO_EMAILS_DESCRICAO}
              </p>
              <div className={styles.comingSoonContainer}>
                <span className={styles.comingSoon}>{CONSTANTES.COMING_SOON}</span>
              </div>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={() => {}}
                disabled
              />
              <span className={`${styles.slider} ${styles.disabled}`}></span>
            </label>
          </div>
        </section>
      </motion.div>
      
      <BottomNav />
    </div>
  );
}