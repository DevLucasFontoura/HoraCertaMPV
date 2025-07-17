"use client";

import TimeConfirmationModal from '../../components/PopUpConfirmacao/popUpConfirmacao';
import { AiOutlineCoffee, AiOutlineLogin, AiOutlineLogout } from 'react-icons/ai';
import PageTransition from '../../components/PageTransition/pageTransition';
import { CONSTANTES } from '../../common/constantes';
import BottomNav from '../../components/Menu/menu';
import styles from './registrarPonto.module.css';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '@mui/material';
import { registroService, TimeRecord } from '../../services/registroService';

interface TimeState {
  hours: string;
  minutes: string;
  seconds: string;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
}

const timeDisplayVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring" as const,
      duration: 0.5
    }
  }
};

// Componente de Confete
const Confetti = ({ isVisible }: { isVisible: boolean }) => {
  const colors = ['#225E', '#3B82F6', '#F59424', '#EF4444', '#8B5CF6', '#06B6D4'];
  const confettiPieces: ConfettiPiece[] = Array.from({ length: 150 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotation: Math.random() * 360,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 8 + 4
  }));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={styles.confettiContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {confettiPieces.map((piece) => (
            <motion.div
              key={piece.id}
              className={styles.confettiPiece}
              style={{
                left: `${piece.x}%`,
                backgroundColor: piece.color,
                width: `${piece.size}px`,
                height: `${piece.size}px`,
              }}
              initial={{
                y: -100,
                x: piece.x,
                rotate: 0,
                opacity: 0
              }}
              animate={{
                y: window.innerHeight + 100,
                x: piece.x + (Math.random() - 0.5) * 100,
                rotate: piece.rotation + 360,
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: 3,
                delay: Math.random() * 0.5,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function RegistrarPonto() {
  const [currentTime, setCurrentTime] = useState<TimeState>({
    hours: '00',
    minutes: '00',
    seconds: '00'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [todayRecords, setTodayRecords] = useState<TimeRecord[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // Estado para controlar quais botões estão habilitados
  const [todayRecord, setTodayRecord] = useState({
    entry: false,
    lunchOut: false,
    lunchReturn: false,
    exit: false
  });

  const [simplifiedMode, setSimplifiedMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRegisterType, setSelectedRegisterType] = useState<'entry' | 'lunchOut' | 'lunchReturn' | 'exit' | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime({
        hours: String(now.getHours()).padStart(2, '0'),
        minutes: String(now.getMinutes()).padStart(2, '0'),
        seconds: String(now.getSeconds()).padStart(2, '0')
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Carregar registros do dia ao montar o componente
  useEffect(() => {
    const carregarRegistrosDoDia = async () => {
      try {
        const registros = await registroService.getRegistrosDoDia();
        setTodayRecords(registros);
        
        // Atualizar estado dos botões baseado nos registros existentes
        const tipos = registros.map(r => r.type);
        setTodayRecord({
          entry: tipos.includes('entry'),
          lunchOut: tipos.includes('lunchOut'),
          lunchReturn: tipos.includes('lunchReturn'),
          exit: tipos.includes('exit')
        });
      } catch (error) {
        console.error('Erro ao carregar registros:', error);
        setError('Erro ao carregar registros do dia');
      }
    };

    carregarRegistrosDoDia();
  }, []);

  const handleRegister = (type: 'entry' | 'lunchOut' | 'lunchReturn' | 'exit') => {
    setSelectedRegisterType(type);
    setIsModalOpen(true);
  };

  const handleConfirmRegister = async () => {
    if (!selectedRegisterType) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Registrar no Firebase
      const success = await registroService.registrarPonto(selectedRegisterType);
      
      if (success) {
        // Recarregar registros do dia para sincronizar
        const registros = await registroService.getRegistrosDoDia();
        setTodayRecords(registros);
        
        // Atualizar estado dos botões
        const tipos = registros.map(r => r.type);
        setTodayRecord({
          entry: tipos.includes('entry'),
          lunchOut: tipos.includes('lunchOut'),
          lunchReturn: tipos.includes('lunchReturn'),
          exit: tipos.includes('exit')
        });
        
        setSuccess('Ponto registrado com sucesso!');
        
        // Mostrar confete
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 3000); // 3 segundos de duração do confete
      } else {
        setError('Erro ao registrar ponto. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao registrar ponto:', error);
      setError('Erro ao registrar ponto. Tente novamente.');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
    }
  };

  return (
    <PageTransition>
      <div className={styles.pageContainer}>
        <Confetti isVisible={showConfetti} />
        
        <header className={styles.pageHeader}>
          <div>
            <motion.h1 
              className={styles.pageTitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {CONSTANTES.TITULO_REGISTRO_DE_PONTO}
            </motion.h1>
            <motion.p 
              className={styles.pageSubtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
            >
              {CONSTANTES.SUBTITULO_REGISTRO_DE_PONTO}
            </motion.p>
          </div>
        </header>

        <div className={styles.content}>
          <div className={styles.mainCard}>
          <motion.div 
            className={styles.timeDisplay}
            initial="hidden"
            animate="visible"
            variants={timeDisplayVariants}
          >
            <div className={styles.timeValue}>
              {currentTime.hours}:{currentTime.minutes}:{currentTime.seconds}
            </div>
            <div className={styles.timeDate}>
              {new Date().toLocaleDateString(CONSTANTES.IDIOMA_PT_BR, { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </motion.div>

          <div className={styles.modeSwitch}>
            <span>Modo simplificado</span>
            <Switch
              checked={simplifiedMode}
              onChange={(e) => setSimplifiedMode(e.target.checked)}
              color="primary"
            />
          </div>

          {loading && <div className={styles.loadingMessage}>Registrando ponto...</div>}
          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}

          <div className={`${styles.buttonGrid} ${simplifiedMode ? styles.simplifiedGrid : ''}`}>
            <button 
              className={styles.timeButton}
              onClick={() => handleRegister('entry')} 
              disabled={loading || todayRecord.entry}
            >
              <div className={styles.buttonIcon}><AiOutlineLogin /></div>
              <div className={styles.buttonLabel}>{CONSTANTES.RP_ENTRADA}</div>
            </button>

            {!simplifiedMode ? (
              <>
                <button 
                  className={styles.timeButton}
                  onClick={() => handleRegister('lunchOut')} 
                  disabled={loading || !todayRecord.entry || todayRecord.lunchOut}
                >
                  <div className={styles.buttonIcon}><AiOutlineCoffee /></div>
                  <div className={styles.buttonLabel}>{CONSTANTES.RP_SAIDA_ALMOCO}</div>
                </button>

                <button 
                  className={styles.timeButton}
                  onClick={() => handleRegister('lunchReturn')} 
                  disabled={loading || !todayRecord.lunchOut || todayRecord.lunchReturn}
                >
                  <div className={styles.buttonIcon}><AiOutlineLogin /></div>
                  <div className={styles.buttonLabel}>{CONSTANTES.RP_RETORNO_ALMOCO}</div>
                </button>
              </>
            ) : (
              <div></div>
            )}

            <button 
              className={styles.timeButton}
              onClick={() => handleRegister('exit')} 
              disabled={loading || (!simplifiedMode ? !todayRecord.lunchReturn : !todayRecord.entry) || todayRecord.exit}
            >
              <div className={styles.buttonIcon}><AiOutlineLogout /></div>
              <div className={styles.buttonLabel}>{CONSTANTES.RP_SAIDA}</div>
            </button>
          </div>

          <motion.div
            className={styles.historySection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className={styles.historyTitle}>{CONSTANTES.RP_HISTORICO_DE_HOJE}</h2>
            <div className={styles.timelineContainer}>
              <div className={styles.timelineWrapper}>
                {todayRecords.map((record, index) => (
                  <motion.div 
                    key={index}
                    className={styles.timelineItem}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={styles.timelineDot} />
                    <div className={styles.timelineContent}>
                      <span className={styles.timelineTime}>{record.time}</span>
                      <span className={styles.timelineLabel}>{record.label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        </div>
      </div>
      <BottomNav />
      
      <TimeConfirmationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmRegister}
        currentTime={new Date()}
      />
    </PageTransition>
  );
}