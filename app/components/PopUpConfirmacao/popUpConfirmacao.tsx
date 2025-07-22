"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { CONSTANTES } from '../../common/constantes';
import styles from './popUpConfirmacao.module.css';
import { useState, useEffect, useRef } from 'react';


interface TimeConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (adjustedTime: Date) => void;
  currentTime: Date;
}

export default function TimeConfirmationModal({ 
  open, 
  onClose, 
  onConfirm, 
  currentTime 
}: TimeConfirmationModalProps) {
  const [timeValue, setTimeValue] = useState('');
  const hasInitialized = useRef(false);

  const handleConfirm = () => {
    if (!timeValue || timeValue.trim() === '') {
      // Se não há valor, usar o horário atual
      onConfirm(currentTime);
    } else {
      const [hours, minutes] = timeValue.split(':').map(Number);
      const newDate = new Date(currentTime);
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      newDate.setSeconds(0);
      onConfirm(newDate);
    }
    onClose();
  };

  const handleClose = () => {
    // Limpar foco antes de fechar
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    onClose();
  };

  useEffect(() => {
    // Só inicializar o timeValue quando o modal abrir pela primeira vez
    if (open && !hasInitialized.current) {
      setTimeValue(currentTime.toLocaleTimeString(CONSTANTES.IDIOMA_PT_BR, { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      }));
      hasInitialized.current = true;
    }
    
    // Reset quando o modal fechar
    if (!open) {
      hasInitialized.current = false;
      setTimeValue('');
    }
  }, [open, currentTime]);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      disableRestoreFocus
      disableAutoFocus
      PaperProps={{
        className: styles.dialog
      }}
    >
      <DialogTitle className={styles.dialogTitle}><strong>{CONSTANTES.TXT_POPUP_CONFIRMACAO_TITULO}</strong></DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <p className={styles.modalText}>{CONSTANTES.TXT_POPUP_CONFIRMACAO_DESCRICAO}</p>
        
        <input
          type="time"
          value={timeValue}
          onChange={(e) => setTimeValue(e.target.value)}
          onClick={(e) => (e.target as HTMLInputElement).focus()}
          onFocus={(e) => (e.target as HTMLInputElement).select()}
          className={styles.timePicker}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '1.5rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f8f8f8',
            cursor: 'text'
          }}
          step={60}
        />
      </DialogContent>
      <DialogActions className={styles.dialogActions}>
        <Button onClick={handleClose} className={styles.cancelButton}>{CONSTANTES.TXT_POPUP_CONFIRMACAO_BOTAO_CANCELAR}</Button>
        <Button onClick={handleConfirm} variant="contained" className={styles.confirmButton}>{CONSTANTES.TXT_POPUP_CONFIRMACAO_BOTAO_CONFIRMAR}</Button>
      </DialogActions>
    </Dialog>
  );
}